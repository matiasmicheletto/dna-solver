import React from 'react';
import { Button, ListGroup, Row, Col } from 'react-bootstrap';
import { FaMinus } from 'react-icons/fa';
import classes from './styles.module.css';

const GAItem = (props) => (
        <ListGroup.Item className={classes.Container}>
            <Row>
                <Col sm="11">
                    <p>{props.ga.name}</p>
                </Col>
                <Col sm="1">
                    <Button 
                        onClick={()=>props.remove(props.ga.id)}
                        variant="danger"
                        className={[classes.BtnRnd, classes.RemoveGABtn]}
                        title="Remove Optimizer">
                        <FaMinus />
                    </Button>
                </Col>
            </Row>
        </ListGroup.Item>
);

export default GAItem;