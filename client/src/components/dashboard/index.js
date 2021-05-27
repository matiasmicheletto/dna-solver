import React, {useState} from 'react';
import PopTable from '../poptable';
import { Row, Col, Card, Button } from 'react-bootstrap';

const Dashboard = (props) => {

    const [gaState, setGAState] = useState(props.ga.status);
    const [tms, setTms] = useState(0); // Algorithm timing is done externally
    const [limit, setLimit] = useState(100); // Upper limit for FFW optimization
    
    const iteration = () => { // Execute a single step of the algorithm and render
        props.ga.evolve();
        setGAState(props.ga.status);
    }

    const go = () => { // Single iteration button callback
        const start = Date.now();
        iteration();
        setTms(tms + Date.now() - start);
    }

    const fast_fw = () => { // FFW button callback
        const start = Date.now();
        const loop = () => { // Recursive function
            if(props.ga.generation < limit)
                setTimeout(()=>{ // When using timeout, a render is performed on every loop
                    iteration();
                    loop();
                }, 10);
            else{ 
                setLimit(limit+100); // Increase limit for next 100 generations
                setTms(tms + Date.now() - start);
            }
        }
        loop();
    }

    const reset = () => { // Restart algorithm button callback
        props.ga.reset();
        setGAState(props.ga.status);
        setLimit(100); 
        setTms(0);
    }

    return (
        <Row>
            <Row>
                <p>Fitness function is <b>y = 1000-(x-511.5)<sup>2</sup>/26.164</b> for <b>x</b> in range <b>(0..1023)</b>.</p> 
                <p>Hit the <i>Evolve!</i> button and let the algorithm find the value of <b>x</b> (column phenotype) that maximizes the fitness function <b>y</b>.</p>
            </Row>
            <Row>
                <Card>
                    <Card.Body>
                        <p><b>Current generation:</b> {gaState.generation}</p>
                        <p><b>Objective function evaluations:</b> {gaState.fitness_evals}</p>
                        <p><b>Running time:</b> {tms} ms.</p>
                    </Card.Body>
                </Card>
            </Row>
            <Row style={{margin:"20px"}}>
                <Col md="auto">
                    <Button variant="primary" onClick={go} title="Next generation">Evolve!</Button>
                </Col>
                <Col md="auto">
                    <Button variant="secondary" onClick={fast_fw} title="Advance 100 generations">Fast forward</Button>
                </Col>
                <Col md="auto">
                    <Button variant="danger" onClick={reset} title="Reset algorithm">Restart</Button>
                </Col>
            </Row>
            
            <Row>
                <PopTable pop={gaState.population} />
            </Row>
        </Row>
    )
}

export default Dashboard;