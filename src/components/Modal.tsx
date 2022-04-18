import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import Footer from '../layout/Footer'
import Button from './Button'

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
  return (
    <>
      <ModalOverlay visible={visible} />
      <ModalWrapper className={className} visible={visible}>
        <ModalInner className="modal-inner">
          <ModalContents>
            {children}
          </ModalContents>
          <Footer>
            <Button color='gray' type='modal' onClick={() => {onBackClicked && onBackClicked()}}>{backString}</Button>
            <Button color='blue' type='modal' onClick={() => {onSelectClicked && onSelectClicked()}}>{selectString}</Button>
          </Footer>
        </ModalInner>
      </ModalWrapper>
    </>
  )
}


Modal.defaultProps = {
    visible: true,


    backVisible: true,
    backString: "Back",
    selectVisible: true,
    selectString: "Select",
  };


const ModalOverlay = styled.div< { visible : boolean }>`
  box-sizing: border-box;
  display: ${(props) => (props.visible ? 'block' : 'none')};
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.3);
  z-index: 999;
`

const ModalWrapper = styled.div< { visible : boolean }>`
  box-sizing: border-box;
  display: ${(props) => (props.visible ? 'block' : 'none')};
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 1000;
  overflow: auto;
  outline: 0;
  tabIndex: -1;
`

const ModalInner = styled.div` 
  box-sizing: border-box;
  position: relative;
  background-color: #ffffff;
  border-radius: 8px;
  width: 420px;
  height: 260px;

  top: 50%;
  transform: translateY(-50%);

  margin: auto;
  tabIndex: 0;
  color: #000000;
`
const ModalContents = styled.div`
  background-color: #ffffff;
  width: 420px;

  tabIndex: 0;
  color: #000000;
`

export default Modal;