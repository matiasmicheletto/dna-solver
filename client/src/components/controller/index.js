import React, { useState, useContext } from 'react';
import { Button, Row } from 'react-bootstrap';
import { FaPlay, FaUndo } from 'react-icons/fa';
import classes from './styles.module.css';
import { OMContext } from '../../context/ManagerContext';
import { LoadingContext } from '../../context/LoadingContext';

const Controller = () => {

    const om = useContext(OMContext);

    const run = () => {
        om.optimize(1, 100)
        .then(res=>{
            console.log(res);
        });
    }

    const reset = () => {
        om.reset();
    }

    return (
        <Row>
            <div className={classes.Container}>
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
        </Row>
    );
}

export default Controller;