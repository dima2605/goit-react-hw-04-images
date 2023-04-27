import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { createPortal } from 'react-dom';
import { ModalWindow, Overlay } from './Modal.styled';

const modalRoot = document.querySelector('#modal-root');

export default class Modal extends PureComponent {
  componentDidMount() {
    window.addEventListener('keydown', this.closeEscModal);
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.closeEscModal);
  }

  closeEscModal = e => {
    if (e.code === 'Escape') {
      this.props.closeModal();
    }
  };

  handleBackDropClick = e => {
    if (e.currentTarget === e.target) {
      this.props.closeModal();
    }
  };

  render() {
    return createPortal(
      <div>
        <Overlay onClick={this.handleBackDropClick}>
          <ModalWindow>
            <img src={this.props.showModal} alt="" />
          </ModalWindow>
        </Overlay>
      </div>,
      modalRoot
    );
  }
}

Modal.propTypes = {
  showModal: PropTypes.string.isRequired,
};
