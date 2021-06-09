import React, { useState, useContext } from 'react';
import { Button, Row, Col } from 'react-bootstrap';
import { FaPlus } from 'react-icons/fa';
import FitnessSelect from '../fitnessselect';
import { fitness_types } from '../../manager';
import FitnessItem from '../fitnessitem';
import classes from './styles.module.css';
import { OMContext } from '../../context/ManagerContext';

const Configurator = () => {

    const om = useContext(OMContext);
    const [f_type, setFType] = useState(fitness_types.TSP);
    const [fitness_list, setFitnessList] = useState(om.fitness_list);

    const add_fitness = () => {
        om.add_fitness(f_type);
        setFitnessList([...om.fitness_list]);
    };

    const remove_fitness = id => {
        om.remove_fitness(id);
        setFitnessList([...om.fitness_list]);
    }

    const fitnessSelection = e => { // Fitness select callback
        setFType(e.target.value);
    };

    return (
        <div>
            <Row className={classes.FitnessListContainer}>
                <Row style={{margin:"0px"}}>
                {
                    fitness_list.length > 0 ?
                        fitness_list.map( f => <FitnessItem key={f.id} fitness={f} remove={remove_fitness}/> )
                    :
                        <center style={{margin:"50px 0px 50px 0px"}}><h4>No objective functions added yet</h4></center>
                }
                </Row>
                <Row>
                    <Col xs={{span:8, offset:3}} md={{span:6, offset:5}} lg={{span:3, offset:8}} className={classes.FitnessSelectContainer}>
                        <FitnessSelect onChange={fitnessSelection} />
                    </Col>
                    <Col xs="1" align="right">
                        <Button 
                            variant="success"
                            className={[classes.BtnRnd, classes.AddFitnessBtn]} 
                            onClick={add_fitness}
                            title="Add Fitness Function">
                            <FaPlus />
                        </Button>                    
                    </Col>
                </Row>
            </Row>
        </div>
    );
}

export default Configurator;