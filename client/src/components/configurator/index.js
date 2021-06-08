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
    const [fitness_list, setFitnessList] = useState(om.fitness);

    const add_fitness = () => {
        om.add_fitness(f_type);
        setFitnessList([...om.fitness]);
    };

    const remove_fitness = id => {
        om.remove_fitness(id);
        setFitnessList([...om.fitness]);
    }

    const fitnessSelection = e => { // Fitness select callback
        setFType(e.target.value);
    };

    return (
        <div>
            <Row className={classes.FitnessSelectContainer} md="auto">
                <FitnessSelect onChange={fitnessSelection} />
            </Row>
            <Row className={classes.FitnessListContainer}>
                <Row>
                {
                    fitness_list.length > 0 ?
                        fitness_list.map( (f, ind) => <FitnessItem key={ind} fitness={f} remove={remove_fitness}/> )
                    :
                        <center><h4>No objective functions added yet</h4></center>
                }
                </Row>
                <Row>
                    <Col sm={{span: 1, offset:11}} align="right">
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