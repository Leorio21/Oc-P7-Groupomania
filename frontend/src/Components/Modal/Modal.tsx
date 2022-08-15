import classNames from 'classnames';
import cn from './Modal.module.scss';

interface ModalProps {
    text: string
    onCloseModal: React.MouseEventHandler
}

const Modal = ({text, onCloseModal}: ModalProps) => {
    
    return (
        <div className={classNames(cn.overlay)} onClick={onCloseModal}>
            <button className={classNames(cn['modal-button'])} onClick={onCloseModal}>X</button>
            <div className={classNames(cn['modal-card'])}>
                {text}
            </div>
        </div>
    )
}

export default Modal