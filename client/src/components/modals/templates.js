import React from 'react';
import { Modal, Button } from 'react-bootstrap';

const EmptyLGModal = props => (
    <Modal {...props} size="xl" centered>
        <Modal.Header>
            <Modal.Title>{props.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            {props.children}
        </Modal.Body>
        <Modal.Footer>
            <Button variant="secondary" onClick={props.onHide}>
                Close
            </Button>            
        </Modal.Footer>
    </Modal>    
);

export default EmptyLGModal;