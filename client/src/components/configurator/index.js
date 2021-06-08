import React, { useState, useContext } from 'react';
import { Button, Row, Col } from 'react-bootstrap';
import { FaPlus } from 'react-icons/fa';
import FitnessSelect from '../fitnessselect';
import { fitness as fitness_type } from '../../manager';
import FitnessItem from '../fitnessitem';
import classes from './styles.module.css';
import { OMContext } from '../../context/ManagerContext';

const Configurator = props => {

    const om = useContext(OMContext);

    const [f_type, setFType] = useState(fitness_type.TSP);
    const [fitness_list, setFitnessList] = useState([]);

    const add_fitness = () => {
        om.add_fitness(f_type);
        setFitnessList([...om.fitness]);
    };

    const fitnessSelection = e => { // Fitness select callback
        setFType(e.target.value);
    };

    return (
        <div>
            <Row className={classes.FitnessSelectContainer}>
                <FitnessSelect onChange={fitnessSelection} />
            </Row>
            {fitness_list.map( (f, ind) => <FitnessItem key={ind} fitness={f} /> )}
            <Row>
                <Col sm={{span: 1, offset:11}}>
                    <Button 
                        variant="success"
                        className={[classes.BtnRnd, classes.AddFitnessBtn]} 
                        onClick={add_fitness}
                        title="Add Fitness Function">
                        <FaPlus />
                    </Button>
                </Col>
            </Row>
        </div>
    );
}

export default Configurator;