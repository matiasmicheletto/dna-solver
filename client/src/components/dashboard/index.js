import React, { useState } from 'react';
import { Card, ListGroup, Button, Row, Col } from 'react-bootstrap';
import { FaPlus, FaMinus } from 'react-icons/fa';
import FitnessSelect from './fitness_select';
import { fitness as fitness_type } from '../../manager';
import FitnessItem from '../fitnessitem';
import GAItem from '../gaitem';
import classes from './styles.module.css';

const Dashboard = (props) => {

    const [f_type, setFType] = useState(fitness_type.TSP);
    const [fitness_list, setFitnessList] = useState([]);
    const [ga_list, setGAList] = useState([]);

    const add_fitness = () => {
        props.manager.add_fitness(f_type);
        setFitnessList([...props.manager.fitness]);
    };

    const add_ga = fitness_id => {
        props.manager.add_ga(fitness_id);
        setGAList([...props.manager.ga]);
    };

    const remove_ga = ga_id => {
        props.manager.remove_ga(ga_id);        
        setGAList([...props.manager.ga]);        
    }

    const fitnessSelection = e => { // Fitness select callback
        setFType(e.target.value);
    };

    return (
        <div>
            <Row className={classes.FitnessSelectContainer}>
                <FitnessSelect onChange={fitnessSelection} />
            </Row>

            {
                fitness_list.map( (fitness, ind) => (
                    <Card key={ind} className={classes.FitnessCard}>
                        <Card.Body>
                            <Row>
                                <FitnessItem fitness={fitness}></FitnessItem>
                            </Row>
                            <Row>
                                <ListGroup className={classes.GAList}>
                                {    
                                    ga_list.map( (ga, ind2) => (
                                        ga.fitness_id === fitness.id && <GAItem key={ind2} ga={ga} remove={remove_ga}/>
                                    ))
                                }
                                </ListGroup>
                            </Row>
                            <Row>
                                <Col sm={{span: 1, offset:11}}>
                                    <Button 
                                        className={[classes.BtnRnd, classes.AddGABtn]} 
                                        onClick={()=>add_ga(fitness.id)}
                                        title="Add Optimizer">
                                        <FaPlus />
                                    </Button>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                ))
            }
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

export default Dashboard;