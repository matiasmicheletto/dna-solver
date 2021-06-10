import React from 'react';
import { Modal } from 'react-bootstrap';
import EmptyLGModal from './templates';

const HelpModal = props => (
    <EmptyLGModal {...props} title="User instructions">
        <Modal.Body>
            
        </Modal.Body>  
    </EmptyLGModal>
);

export default HelpModal;