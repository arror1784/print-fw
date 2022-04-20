import React from 'react';
import classNames from 'classnames';
import './Button.scss';

type ButtonProps = {
  children?: React.ReactNode;
  type: string;
  color: string;
  onClick?: () => void;
  enable: boolean;
}

function Button({children,type,color,enable,onClick} : ButtonProps){
  return (
    <button className={ classNames('Button',type,color,{ 'enable-false': !enable })} onClick={() => {(onClick && enable) && onClick()}} >{children}</button>
  );
}

Button.defaultProps = {
    type: '',
    color: 'blue',
    enable: true
  };

export default Button;