import React, { useState, useContext } from 'react';
import { Card, ListGroup,  Button, Row, Col } from 'react-bootstrap';
import GAItem from '../gaitem';
import { FaDna, FaTimes, FaEllipsisV } from 'react-icons/fa';
import classes from './styles.module.css';
import { OMContext } from '../../context/ManagerContext';

const FitnessItem = props => {

    const om = useContext(OMContext);
    const [ga_list, setGAList] = useState(om.get_ga_list(props.fitness.id));

    const add_ga = fitness_id => {
        om.add_ga(fitness_id);
        setGAList(om.get_ga_list(props.fitness.id));
    };

    const remove_ga = ga_id => {
        om.remove_ga(ga_id);        
        setGAList(om.get_ga_list(props.fitness.id));        
    }

    return (
        <Card className={classes.FitnessCard}>
            <Card.Title className="p-2">
                <Row>
                    <Col>
                        <h4>{props.fitness.name}</h4>
                    </Col>
                    <Col align="right">
                        <Button 
                            variant="flat"
                            onClick={()=>{}}
                            title="Configure Fitness">
                            <FaEllipsisV />
                        </Button>
                        <Button 
                            variant="flat"
                            onClick={()=>{props.remove(props.fitness.id)}}
                            title="Remove Fitness">
                            <FaTimes />
                        </Button>
                    </Col>
                </Row>
            </Card.Title>
            <Card.Body>
                <Row>
                    <ListGroup className={classes.GAList}>                        
                    {    
                        ga_list.length > 0 ?
                            ga_list.map( ga => <GAItem key={ga.id} ga={ga} remove={remove_ga}/> )
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
    )
}
    
export default FitnessItem;