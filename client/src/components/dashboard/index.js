import React, {useState} from 'react';
import PopTable from '../poptable';
import { Row, Col, Card, Button } from 'react-bootstrap';

const Dashboard = (props) => {

    const [gen, setGen] = useState(0); // Generation counter
    const [ffe, setFFE] = useState(0); // Fitness Funcion Evaluations
    const [tms, setTms] = useState(0); // Algorithm xecution time
    const [pop, setPop] = useState(props.ga.status.population); // Population list
    const [limit, setLimit] = useState(100); // Upper limit for FFW optimization
    
    const iteration = () => { // Execute a single step of the algorithm and render
        props.ga.evolve();
        const s = props.ga.status; // To avoid run the getter multiple times
        setGen(props.ga.generation);
        setFFE(s.fitness_evals);
        setPop(s.population);
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

    return (
        <Row>
            <Row>
                <p>Fitness function is <b>y = 1000-(x-181)<sup>2</sup></b> for <b>x</b> in range <b>(0..65535)</b>.</p> 
                <p>Hit the <i>Evolve!</i> button and let the algorithm find the value of <b>x</b> (column phenotype) that maximizes the fitness function <b>y</b>.</p>
            </Row>
            <Row>
                <Card>
                    <Card.Body>
                        <p><b>Current generation:</b> {gen}</p>
                        <p><b>Objective function evaluations:</b> {ffe}</p>
                        <p><b>Running time:</b> {tms} ms.</p>
                    </Card.Body>
                </Card>
            </Row>
            <Row style={{margin:"20px"}}>
                <Col md="auto">
                    <Button variant="primary" onClick={go} title="Next generation">Evolve!</Button>
                </Col>
                <Col md="auto">
                    <Button variant="danger" onClick={fast_fw} title="Advance 100 generations">Fast forward</Button>
                </Col>
            </Row>
            
            <Row>
                <PopTable pop={pop} />
            </Row>
        </Row>
    )
}

export default Dashboard;