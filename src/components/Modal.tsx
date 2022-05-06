import React from 'react'
import ReactModal from 'react-modal'

import styled from 'styled-components'
import Footer from '../layout/Footer'
import Button from './Button'

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',

    width: "420px",
    height: "280px",
    outline: 'none',
    padding: "0px",
    borderRadius: '8px',

  },
  overlay: {
    background: "#00000050",
    padding: "0px"
  }
};

interface ModalProps{
    className?: string,
    visible: boolean,
    children?: React.ReactNode,

    backVisible?: boolean,
    selectVisible?: boolean,

    backString?: string,
    selectString?: string,

    onBackClicked?: () => void,
    onSelectClicked?: () => void,
}
function Modal({ className, visible, children, backVisible,backString,onBackClicked,selectVisible,selectString,onSelectClicked } : ModalProps) {
  const [modalIsOpen, setIsOpen] = React.useState(visible);
  return (
    <ReactModal isOpen={visible} style={customStyles}>
        {children}
        <Footer>
          <Button color='gray' type='modal' onClick={() => {onBackClicked && onBackClicked()}} visible={backVisible}>{backString}</Button>
          <Button color='blue' type='modal' onClick={() => {onSelectClicked && onSelectClicked()}} visible={selectVisible}>{selectString}</Button>
        </Footer>
    </ReactModal>
  )
}


Modal.defaultProps = {
  visible: true,


  backVisible: true,
  backString: "Back",
  selectVisible: true,
  selectString: "Select",
};

export default Modal;