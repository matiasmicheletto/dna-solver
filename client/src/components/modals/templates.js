import React from 'react';
import { Modal, Button } from 'react-bootstrap';

const EmptyLGModal = props => (
    <Modal {...props} size="lg" centered>
        <Modal.Header>
            <Modal.Title>{props.title}</Modal.Title>
        </Modal.Header>
        {props.children}
        <Modal.Footer>
            <Button variant="secondary" onClick={props.onHide}>
                Ok
            </Button>            
        </Modal.Footer>
    </Modal>    
);

export default EmptyLGModal;