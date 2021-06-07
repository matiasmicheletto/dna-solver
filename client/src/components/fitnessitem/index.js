import React, { useState, useContext } from 'react';
import { Card, ListGroup,  Button, Row, Col } from 'react-bootstrap';
import GAItem from '../gaitem';
import { FaPlus } from 'react-icons/fa';
import classes from './styles.module.css';
import { OMContext } from '../../ManagerContext';

const FitnessItem = props => {

    const om = useContext(OMContext);
    const [ga_list, setGAList] = useState([]);

    const add_ga = fitness_id => {
        om.add_ga(fitness_id);
        setGAList([...om.ga]);
    };

    const remove_ga = ga_id => {
        om.remove_ga(ga_id);        
        setGAList([...om.ga]);        
    }

    return (
        <Card className={classes.FitnessCard}>
            <Card.Body>
                <Row>
                    <p>{props.fitness.name}</p>
                </Row>
                <Row>
                    <ListGroup className={classes.GAList}>
                    {    
                        ga_list.map( (ga, ind) => (
                            (ga.fitness_id === props.fitness.id )
                            && 
                            <GAItem key={ind} ga={ga} remove={remove_ga}/>
                        ))
                    }
                    </ListGroup>
                </Row>
                <Row>
                    <Col sm={{span: 1, offset:11}}>
                        <Button 
                            className={[classes.BtnRnd, classes.AddGABtn]} 
                            onClick={()=>add_ga(props.fitness.id)}
                            title="Add Optimizer">
                            <FaPlus />
                        </Button>
                    </Col>
                </Row>
            </Card.Body>
        </Card>
    )
}
    
export default FitnessItem;