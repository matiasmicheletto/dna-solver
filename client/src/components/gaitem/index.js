import React, { useState } from 'react';
import { Button, ListGroup, Row, Col, Collapse } from 'react-bootstrap';
import { FaTrashAlt, FaTools, FaEye } from 'react-icons/fa';
import classes from './styles.module.css';
import PopTable from '../poptable';

const GAItem = props => {
    const [showPop, setShowPop] = useState(false);

    const ga = props.ga.status;

    return (
        <ListGroup.Item className={classes.Container}>
            <Row>
                <Col sm="10" className={classes.GAStatus}>
                    <p className={classes.GAName}><i>{ga.name}</i></p>
                    <Row className={classes.GAStatusDetails}>
                        <Col>
                            <p>Current generation: {ga.generation}</p>
                            <p>Fitness evaluations: {ga.fitness_evals}</p>
                        </Col>
                        <Col>
                            <p>Best solution: {ga.best}</p> 
                            <p>Best value = {ga.best_objective}</p> 
                            <p>Best fitness = {ga.best_fitness.toFixed(2)}</p>
                        </Col>
                    </Row>
                </Col>
                <Col sm="2" align="right">
                    <div className={classes.MenuContainer}>
                        <Button 
                            className={classes.MenuGABtn}
                            variant="success"
                            onClick={()=>setShowPop(!showPop)}
                            title="View population">
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
                            onClick={()=>props.remove(ga.id)}
                            title="Remove Optimizer">
                            <FaTrashAlt />
                        </Button>
                    </div>
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