/*
Copyright (C) 2006 Pedro Felzenszwalb

This program is free software; you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation; either version 2 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program; if not, write to the Free Software
Foundation, Inc., 59 Temple Place, Suite 330, Boston, MA  02111-1307 USA
*/

/* distance transform */

#ifndef DT_H
#define DT_H

#include <algorithm>
#include "image.h"

#include <execution>

#define INF 1E20

typedef uint8_t uchar;
template<typename ValType>
ValType inline square(ValType a)
{
    return a * a;
}

/* dt of 1d function using squared distance */
static float *dt(float *f, int n) {
  float *d = new float[n];
  int *v = new int[n];
  float *z = new float[n+1];
  int k = 0;
  v[0] = 0;
  z[0] = -INF;
  z[1] = +INF;
  for (int q = 1; q <= n-1; q++) {
    float s  = ((f[q]+square(q))-(f[v[k]]+square(v[k])))/(2*q-2*v[k]);
    while (s <= z[k]) {
      k--;
      s  = ((f[q]+square(q))-(f[v[k]]+square(v[k])))/(2*q-2*v[k]);
    }
    k++;
    v[k] = q;
    z[k] = s;
    z[k+1] = +INF;
  }

  k = 0;
  for (int q = 0; q <= n-1; q++) {
    while (z[k+1] < q)
      k++;
    d[q] = square(q-v[k]) + f[v[k]];
  }

  delete [] v;
  delete [] z;
  return d;
}

/* dt of 2d function using squared distance */
static void dt(image<float> *im, float yMult) {
    const float yMultSquared = yMult * yMult;
    const int width = im->width();
    const int height = im->height();

      std::vector<int> iter_width(width,0);
      std::vector<int> iter_height(height,0);

      std::generate(iter_width.begin(), iter_width.end(), [n = 0]() mutable { return n++; });
      std::generate(iter_height.begin(), iter_height.end(), [n = 0]() mutable { return n++; });

      std::for_each(std::execution::par_unseq,iter_width.begin(),iter_width.end(),[&](int i){

          float *f = new float[std::max(width,height)];

          for (int y = 0; y < height; y++) {
            f[y] = imRef(im, i, y);
          }
          float *d = dt(f, height);
          for (int y = 0; y < height; y++) {
            imRef(im, i, y) = d[y] * yMultSquared;

          }
          delete [] d;
          delete [] f;

      });

      std::for_each(std::execution::par_unseq,iter_height.begin(),iter_height.end(),[&](int i){

          float *f = new float[std::max(width,height)];

          for (int x = 0; x < width; x++) {
            f[x] = imRef(im, x, i);
          }
          float *d = dt(f, width);
          for (int x = 0; x < width; x++) {
            imRef(im, x, i) = d[x];
          }
          delete [] d;
          delete [] f;

      });
}


/* dt of binary image using squared distance */
static image<float> *dt(image<uchar> *im, uchar on, float yMult) {
  int width = im->width();
  int height = im->height();

  image<float> *out = new image<float>(width, height, false);
  for (int y = 0; y < height; y++) {
    for (int x = 0; x < width; x++) {
      if (imRef(im, x, y) == on)
	imRef(out, x, y) = 0;
      else
	imRef(out, x, y) = INF;
    }
  }

  dt(out, yMult);
  return out;
}

#endif
