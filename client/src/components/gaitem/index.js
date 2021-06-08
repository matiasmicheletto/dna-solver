import React from 'react';
import { Button, ListGroup, Row, Col } from 'react-bootstrap';
import { FaTrashAlt, FaTools, FaEye } from 'react-icons/fa';
import classes from './styles.module.css';

const GAItem = props => (
    <ListGroup.Item className={classes.Container}>
        <Row>
            <Col sm="10">
                <p>{props.ga.name}</p>
            </Col>
            <Col sm="2" align="right">
                <div className={classes.MenuContainer}>
                    <Button 
                        className={classes.MenuGABtn}
                        variant="success"
                        onClick={()=>{}}
                        title="View status">
                        <FaEye />
                    </Button>
                    <Button 
                        className={classes.MenuGABtn}
                        onClick={()=>{}}
                        title="Configure Optimizer">
                        <FaTools />
                    </Button>
                    <Button 
                        className={classes.MenuGABtn}
                        variant="danger"
                        onClick={()=>props.remove(props.ga.id)}
                        title="Remove Optimizer">
                        <FaTrashAlt />
                    </Button>
                </div>
            </Col>
        </Row>
    </ListGroup.Item>
);

export default GAItem;