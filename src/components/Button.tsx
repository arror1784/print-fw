import React from 'react';
import classNames from 'classnames';
import './Button.scss';

type ButtonProps = {
  children?: React.ReactNode;
  type: string;
  color: string;
  onClick?: () => void;

}

function Button({children,type,color,onClick} : ButtonProps){
  return (
    <button className={ classNames('Button',type,color,)} onClick={onClick} >{children}</button>
  );
}

Button.defaultProps = {
    type: '',
    color: 'blue'
  };

export default Button;