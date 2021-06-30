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
import { 
    FaTrashAlt, 
    FaTools, 
    FaCopy, 
    FaEye, 
    FaPlay, 
    FaPause 
} from 'react-icons/fa';
import classes from './styles.module.css';
import PopTable from '../poptable';
import SolutionViewer from '../solutionviewer';
import GAConfigForm from '../gaconfigform';

const GAItem = props => {
    const [showPop, setShowPop] = useState(false); // Expand/collapse population table
    const [showConfig, setShowConfig] = useState(false); // Expand/collapse config form
    const [gaconfig, setGAConfig] = useState(props.ga.config); // GA configuration state
    const [nameEdit, setNameEdit] = useState(false); // Show/hide name editor input
    const [name, setName] = useState(props.ga.name); // Current name state
    const [update, setUpdate] = useState(false); // Dummy setstate for updating forms

    const updateGAParam = (param, value) => {
        // No need to use the experiment manager to set the config
        props.ga[param] = value; 
        setGAConfig(props.ga.config);
        setUpdate(!update);
    }

    const updateName = () => { // Callback for the update name button
        props.ga.name = name;
        setNameEdit(false);
    }

    const status = props.ga.status;    
    const freezed = props.ga.freezed;
    const color = props.ga.color ? props.ga.color : "lightblue";

    return (
        <ListGroup.Item className={classes.Container} style={{backgroundColor:color, color:freezed?"lightgray":"black"}}>
            <Row>
                <Col xs="10" sm="11" md="10" lg="10" className={classes.GAStatus}>
                    {
                        nameEdit ?
                        <InputGroup as={Col} sm className={classes.NameInputGroup}>
                            <InputGroup.Text className={classes.NameInputLabel}>New name</InputGroup.Text>
                            <Form.Control
                                className={classes.NameForm}
                                type="text"
                                placeholder="New name"                                
                                defaultValue={status.name}
                                onChange={v => {setName(v.target.value)}}
                            >
                            </Form.Control>
                            <Button                                 
                                className={classes.NameButtonOk}
                                onClick={updateName}>Update</Button>
                            <Button                                 
                                className={classes.NameButtonCancel}
                                onClick={()=>setNameEdit(false)}>Cancel</Button>
                        </InputGroup>
                        :
                        <p className={classes.GAName} onClick={()=>setNameEdit(true)}><i>{status.name + (freezed ? " (Freezed)" : "")}</i></p>
                    }
                    <Row className={classes.GAStatusDetails}>
                        <Col sm="12" md="6">
                            <p><b>Current generation:</b> {status.generation}</p>
                            <p><b>Fitness evaluations:</b> {status.fitness_evals}</p>
                        </Col>
                        <Col sm="12" md="6">
                            <p><b>Best solution:</b> <SolutionViewer genotype={status.best} fitness={props.ga.fitness} /></p> 
                            <p><b>Best value:</b> {status.best_objective}</p>                             
                        </Col>
                    </Row>
                </Col>
                <Col xs="2" sm="1" md="2" lg="2" align="center" className="p-0">
                    <Row className={["m-0", "p-0"]}>
                        <Col md="12" lg="2" className="p-0">
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
                        <Col md="12" lg="2" className="p-0">
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
                        <Col md="12" lg="2" className="p-0">
                            <Button 
                                className={classes.MenuGABtn}
                                variant="secondary"
                                onClick={()=>{props.toggle_freeze(status.id)}}
                                title={freezed ? "Unfreeze optimizer" : "Freeze optimizer"}>
                                {
                                    freezed ?
                                        <FaPause />
                                    :
                                        <FaPlay />
                                }
                                
                            </Button>
                        </Col>
                        <Col md="12" lg="2" className="p-0">
                            <Button 
                                className={classes.MenuGABtn}
                                variant="dark"
                                onClick={()=>{props.copy(status.id)}}
                                title="Copy optimizer configuration">
                                <FaCopy />
                            </Button>
                        </Col>
                        <Col md="12" lg="2" className="p-0">
                            <Button 
                                className={classes.MenuGABtn}
                                variant="danger"
                                onClick={()=>props.remove(status.id)}
                                title="Remove optimizer">
                                <FaTrashAlt />
                            </Button>
                        </Col>
                    </Row>
                </Col>
            </Row>
            <Collapse in={showPop}>
                <Row>
                    <PopTable ga={props.ga}></PopTable>
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