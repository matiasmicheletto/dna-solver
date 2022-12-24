import React from 'react';
import { Form, Row, Col, InputGroup } from 'react-bootstrap';
import classes from './styles.module.css';

/*
    QuadraticConfig Component
    -----------------------
    This component renders the problem description and the
    form that allows to configure the parameters of the 
    quadratic fitness function.
    For now this component configure almos everything and
    handles its own state with the fitness parameters
    but everything will be moved to the experiment manager
    and the fitnessitem component will handle the rendering
*/

const QuadraticConfig = props => {
    return (
        <Form className={classes.Container}>
            <div className={classes.ProblemDesc}>
                <h5>Problem description</h5>
                <p>Fitness function is a parabola given by <b>y = a - (x-c)<sup>2</sup>/b</b>. From calculus 
                we know that the maximum value that the function can reach is <b>a</b>, so given this value 
                and the number of encoding bits, the parameters <b>b</b> and <b>c</b> can be adjusted in 
                order to obtain a positive fitness function for the encoded range <b>000...0</b> to <b>111...1</b>.</p>
                <p>The current configuration give us the function <b>y = {props.fitness.a}-(x-{props.fitness.c})<sup>2</sup>/{(1/props.fitness.b).toFixed(2)}</b> for <b>x</b> in range <b>(0..{props.fitness.z1+1})</b>.</p>
            </div>
            <Row>
                <Col sm="12" md="6">
                    <InputGroup>
                        <InputGroup.Text>Bitstring length</InputGroup.Text>
                        <Form.Control                    
                            type="number"
                            placeholder="Bitstring lenght"
                            min="4"
                            max="32"
                            defaultValue={props.fitness.nbit}
                            onChange={v => props.configure({nbit: parseInt(v.target.value)})}
                        >
                        </Form.Control>
                    </InputGroup>
                </Col>
                <Col sm="12" md="6">
                    <InputGroup>
                        <InputGroup.Text>Maximum fitness</InputGroup.Text>
                        <Form.Control                    
                            type="number"
                            placeholder="Maximum fitness"
                            min="10"
                            max="10000"
                            step="10"
                            defaultValue={props.fitness.a}
                            onChange={v => props.configure({a: parseInt(v.target.value)})}
                        >
                        </Form.Control>
                    </InputGroup>
                </Col>
            </Row>
            
            
        </Form>
    );
};

export default QuadraticConfig;