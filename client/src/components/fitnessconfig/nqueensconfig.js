import React from 'react';
import { Row, Col, Form, InputGroup } from 'react-bootstrap';
import classes from './styles.module.css';

/*
    NQueensConfig Component
    -----------------------
    This component renders the form required to configure
    all of the N-Queens fitness model parameters, which
    is just "N", the chessboard size or queens number.
*/

const NQueensConfig = props => {
    return (
        <Form className={classes.Container}>
            <InputGroup>
                <InputGroup.Text>Chessboard Size</InputGroup.Text>
                <Form.Control
                    type="number"
                    placeholder="Chessboard size"
                    min="4"
                    max="100"
                    defaultValue={8}
                    onChange={v => props.configure({N: parseInt(v.target.value)})}
                >
                </Form.Control>
            </InputGroup>
        </Form>
    );
};

export default NQueensConfig;