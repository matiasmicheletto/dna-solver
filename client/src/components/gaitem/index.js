import React, { useState } from 'react';
import { Button, ListGroup, Row, Col, Collapse } from 'react-bootstrap';
import { FaTrashAlt, FaTools, FaEye } from 'react-icons/fa';
import classes from './styles.module.css';
import PopTable from '../poptable';

const GAItem = props => {
    const [showPop, setShowPop] = useState(false);

    const ga = props.ga.status;

    const color = props.ga.color ? props.ga.color : "lightblue"

    return (
        <ListGroup.Item className={classes.Container} style={{backgroundColor:color}}>
            <Row>
                <Col xs="11" md="10" xl="11" className={classes.GAStatus}>
                    <p className={classes.GAName}><i>{ga.name}</i></p>
                    <Row className={classes.GAStatusDetails}>
                        <Col sm="12" md="6">
                            <p><b>Current generation:</b> {ga.generation}</p>
                            <p><b>Fitness evaluations:</b> {ga.fitness_evals}</p>
                        </Col>
                        <Col sm="12" md="6">
                            <p><b>Best solution:</b> {ga.best}</p> 
                            <p><b>Best value:</b> {ga.best_objective}</p>                             
                        </Col>
                    </Row>
                </Col>
                <Col xs="1" md="2" xl="1" align="right">
                    <Row className="justify-content-md-center">
                        <Col sm="12" md="4" className="p-0">
                            <Button 
                                className={classes.MenuGABtn}
                                variant="success"
                                onClick={()=>setShowPop(!showPop)}
                                title="View population">
                                <FaEye />
                            </Button>
                        </Col>
                        <Col sm="12" md="4" className="p-0">
                            <Button 
                                className={classes.MenuGABtn}
                                onClick={()=>{}}
                                title="Configure Optimizer">
                                <FaTools />
                            </Button>
                        </Col>
                        <Col sm="12" md="4" className="p-0">
                            <Button 
                                className={classes.MenuGABtn}
                                variant="danger"
                                onClick={()=>props.remove(ga.id)}
                                title="Remove Optimizer">
                                <FaTrashAlt />
                            </Button>
                        </Col>
                    </Row>
                </Col>
            </Row>
            <Collapse in={showPop}>
                <Row>
                    <PopTable pop={ga.population}></PopTable>
                </Row>
            </Collapse>
        </ListGroup.Item>
    );
}

export default GAItem;