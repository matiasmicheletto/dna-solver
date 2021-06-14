import React, { useContext, useState } from 'react';
import { Button, Row, Col, Form } from 'react-bootstrap';
import { FaPlay, FaUndo } from 'react-icons/fa';
import classes from './styles.module.css';
import { OMContext } from '../../context/ManagerContext';
import { LoadingContext } from '../../context/LoadingContext';

const Controller = props => {

    const om = useContext(OMContext);
    const {loading, setLoading} = useContext(LoadingContext);

    const [rounds, setRounds] = useState(10);
    const [iters, setIters] = useState(100);

    const run = () => {
        setLoading(true);
        // The optimize is called inside a setTimeout because
        // the setState function is async too, and the preloader
        // will not be shown.
        // Also props.onChange is not needed as the setLoading
        // will change the state on the dashboard, and trigger
        // a render.
        setTimeout(()=>{
            om.optimize(rounds, iters);
            setLoading(false);
        }, 1);
    }

    const reset = () => {
        om.reset();
        props.onChange(); // Trigger a dashboard update
    }

    return (
        <div className={classes.Container}>
            <h5>Experiment control</h5>
            
            <Form className={classes.Form}>
                <Row>
                    <Form.Group as={Col}>
                        <Form.Label>Rounds</Form.Label>
                        <Form.Control 
                            type="number" 
                            placeholder="10" 
                            min="1"
                            max="100"
                            defaultValue={rounds}
                            onChange={v=>setRounds(parseInt(v.target.value))}/>                    
                    </Form.Group>
                    <Form.Group as={Col}>
                        <Form.Label>Generations</Form.Label>
                        <Form.Control 
                            type="number" 
                            min="1"
                            max="1000"
                            defaultValue={iters} 
                            onChange={v=>setIters(parseInt(v.target.value))}/>
                    </Form.Group>
                </Row>
            </Form>

            <div className={classes.BtnContainer}>
                <Button 
                    className={classes.ControlBtn}
                    variant="success"
                    onClick={run}
                    title="Start optimization">
                    <FaPlay />
                </Button>
                <Button 
                    className={classes.ControlBtn}
                    variant="danger"
                    onClick={reset}
                    title="Restart optimizers">
                    <FaUndo />
                </Button>
            </div>
        </div>
    );
}

export default Controller;