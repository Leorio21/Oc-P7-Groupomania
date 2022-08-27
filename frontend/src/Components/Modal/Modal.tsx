
import { createPortal } from 'react-dom';

import classNames from 'classnames';
import cn from './Modal.module.scss';

interface ModalProps {
    text: string
    onCloseModal: Function
}

const Modal = ({text, onCloseModal}: ModalProps) => {

    const onClickHandler = () => {
        onCloseModal()
    }
    
    return createPortal(
        <div className={classNames(cn.overlay)} onClick={onClickHandler}>
            <button className={classNames(cn['modal-button'])} onClick={onClickHandler}>X</button>
            <div className={classNames(cn['modal-card'])}>
                {text}
            </div>
        </div>, document.getElementById('modal-root')!
    )
}

export default Modal;