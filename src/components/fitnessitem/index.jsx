import React, { useState, useContext } from 'react';
import { 
    Card, 
    ListGroup,  
    Button, 
    Row, 
    Col,
    Collapse 
} from 'react-bootstrap';
import { FaDna, FaTrashAlt, FaCog, FaCopy } from 'react-icons/fa';
import { ExperimentCtx } from '../../context/ExperimentCtx';
import FitnessConfig from '../fitnessconfig';
import GAItem from '../gaitem';
import classes from './styles.module.css';

/*
    FitnessItem component
    ----------------------
    This component renders a single fitness model with
    it configuration component and the list of optimizers.
    The adding or removing optimizer items is handled here.
*/

const FitnessItem = props => {

    const experiment = useContext(ExperimentCtx);

    const [ga_list, setGAList] = useState(experiment.get_ga_list(props.fitness.id));
    const [config, showConfig] = useState(false); // Controlling the collapse
    
    // Dummy state to trigger a rendering when updating a fitness parameter
    const [update, setUpdate] = useState(false); 

    const add_ga = fitness_id => {
        //experiment.reset();
        experiment.add_ga(fitness_id);        
        setGAList(experiment.get_ga_list(props.fitness.id));
    };

    const remove_ga = ga_id => {
        experiment.remove_ga(ga_id);        
        //experiment.reset();
        setGAList(experiment.get_ga_list(props.fitness.id));
    };

    const copy_ga = ga_id => {
        experiment.duplicate_ga(ga_id);
        setGAList(experiment.get_ga_list(props.fitness.id));
    }

    const toggle_ga_freeze = ga_id => {
        experiment.toggle_ga_freeze(ga_id);
        setUpdate(!update);
    }

    const configure_fitness = config => {
        experiment.set_fitness_config(props.fitness.id, config);
        // Switch dummy variable to trigger update
        // This even render the optimizer items (gaitems), but its correct, 
        // as a change in fitness parameter does affect the optimizers that are reinitialized
        setUpdate(!update); 
    };

    return (
        <Card className={classes.FitnessCard}>
            <Card.Title className="p-2">
                <Row>
                    <Col>
                        <h5>{props.fitness.name}</h5>
                    </Col>
                    <Col align="right">
                        <Button 
                            variant="flat"
                            onClick={()=>showConfig(!config)}
                            title="Configure Fitness">
                            <FaCog />
                        </Button>
                        <Button 
                            variant="flat"
                            onClick={()=>props.copy(props.fitness.id)}
                            title="Copy Fitness">
                            <FaCopy />
                        </Button>
                        <Button 
                            variant="flat"
                            onClick={()=>props.remove(props.fitness.id)}
                            title="Remove Fitness">
                            <FaTrashAlt />
                        </Button>
                    </Col>
                </Row>
                <Collapse in={config}>
                    <Row>
                        <FitnessConfig fitness={props.fitness} configure={configure_fitness} />
                    </Row>
                </Collapse>
            </Card.Title>
            <Card.Body>
                <Row>
                    <ListGroup className={classes.GAList}>                        
                    {    
                        ga_list.length > 0 ?
                            ga_list.map( ga => <GAItem 
                                key={ga.id} 
                                ga={ga} 
                                remove={remove_ga} 
                                copy={copy_ga}
                                toggle_freeze={toggle_ga_freeze}
                                /> 
                            )
                        :
                            <center><h4>No optimizers added yet</h4></center>
                    }
                    </ListGroup>
                </Row>
                <Row>
                    <Col sm={{span: 1, offset:11}} align="right">
                        <Button 
                            className={[classes.BtnRnd, classes.AddGABtn]} 
                            onClick={()=>add_ga(props.fitness.id)}
                            title="Add Optimizer">
                            <FaDna />
                        </Button>
                    </Col>
                </Row>
            </Card.Body>
        </Card>
    );
}
    
export default FitnessItem;