import classNames from 'classnames';
import React, { Children } from 'react'
import Button from './Button';
import './ImageButton.scss'

type ImageButtonProps = {
    src: string;
    type?: string;
    color?: string;

    onClick?: () => void;
    children?: React.ReactNode;
}

function ImageButton({src,type,color,onClick,children} : ImageButtonProps){
    return (
        <Button color={color} type={type}>
            <img className={classNames('Img',type)} src={src} onClick={onClick}/>

            {children}
        </Button>);
}

ImageButton.defaultProps = {
    src: "",
    type: "",
    color: "blue",
}

export default ImageButton;