import React from 'react';
import logo from './logo.svg';

import './App.css';
import './routes'
import AppRoute from './routes';
import { BrowserRouter,HashRouter } from 'react-router-dom'
import ExtraModals from './pages/ExtraPages';

function App() {
  const style = {
    display: "flex", 
    width: "480px",
    'user-select': "none",
    'cursor': "hidden",
  }
  return (
    <div className="App">
      <header className="App-header">
        <div style={style}>
          <HashRouter>
            <AppRoute></AppRoute>
            <ExtraModals></ExtraModals>
          </HashRouter>
        </div>
      </header>
    </div>
  );
}

export default App;
