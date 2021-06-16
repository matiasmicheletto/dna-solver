import React, { useState } from 'react';
import { 
    Button, 
    ListGroup, 
    Row, 
    Col, 
    Collapse, 
    Form, 
    InputGroup 
} from 'react-bootstrap';
import { FaTrashAlt, FaTools, FaEye } from 'react-icons/fa';
import classes from './styles.module.css';
import PopTable from '../poptable';
import GAConfigForm from '../gaconfigform';

const GAItem = props => {
    const [showPop, setShowPop] = useState(false);
    const [showConfig, setShowConfig] = useState(false);
    const [gaconfig, setGAConfig] = useState(props.ga.config);
    const [nameEdit, setNameEdit] = useState(false);
    // Dummy setstate for updating forms
    const [update, setUpdate] = useState(false); 

    const updateGAParam = (param, value) => {
        // No need to use the manager to set the config
        props.ga[param] = value; 
        setGAConfig(props.ga.config);
        setUpdate(!update);
    }

    const ga = props.ga.status;    
    const color = props.ga.color ? props.ga.color : "lightblue";

    return (
        <ListGroup.Item className={classes.Container} style={{backgroundColor:color}}>
            <Row>
                <Col xs="11" md="10" xl="11" className={classes.GAStatus}>
                    {
                        nameEdit ?
                        <InputGroup as={Col} sm className={classes.NameInputGroup}>
                            <InputGroup.Text className={classes.NameInputLabel}>New name</InputGroup.Text>
                            <Form.Control
                                className={classes.NameForm}
                                type="text"
                                placeholder="New name"                                
                                defaultValue={props.ga.name}
                                onChange={v => {props.ga.name = v.target.value;}}
                            >
                            </Form.Control>
                            <Button                                 
                                className={classes.NameInputButton}
                                onClick={()=>setNameEdit(false)}>Update</Button>
                        </InputGroup>
                        :
                        <p className={classes.GAName} onClick={()=>setNameEdit(true)}><i>{ga.name}</i></p>
                    }
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
                                onClick={()=>{
                                    setShowPop(!showPop);
                                    setShowConfig(false);
                                }}
                                title="View population">
                                <FaEye />
                            </Button>
                        </Col>
                        <Col sm="12" md="4" className="p-0">
                            <Button 
                                className={classes.MenuGABtn}
                                onClick={()=>{
                                        setShowConfig(!showConfig);
                                        setShowPop(false);
                                    }
                                }
                                title="Configure optimizer">
                                <FaTools />
                            </Button>
                        </Col>
                        <Col sm="12" md="4" className="p-0">
                            <Button 
                                className={classes.MenuGABtn}
                                variant="danger"
                                onClick={()=>props.remove(ga.id)}
                                title="Remove optimizer">
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
            <Collapse in={showConfig}>
                <Row>
                    <GAConfigForm current={gaconfig} onChange={updateGAParam}/>
                </Row>
            </Collapse>
        </ListGroup.Item>
    );
}

export default GAItem;