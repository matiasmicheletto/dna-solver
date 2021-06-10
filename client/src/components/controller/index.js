import React, { useContext } from 'react';
import { Button, Row } from 'react-bootstrap';
import { FaPlay, FaUndo } from 'react-icons/fa';
import classes from './styles.module.css';
import { OMContext } from '../../context/ManagerContext';
import { LoadingContext } from '../../context/LoadingContext';

const Controller = () => {

    const om = useContext(OMContext);
    const {loading, setLoading} = useContext(LoadingContext);

    const run = () => {
        setLoading(true);
        setTimeout(()=>{ // TODO: avoid this patch
            om.optimize(20, 1000)
            .then(res=>{
                console.log(res);
                setLoading(false);
            });
        }, 1);
    }

    const reset = () => {
        om.reset();
    }

    return (
        <Row>
            <div className={classes.Container}>
            <h5 style={{textAlign:"left"}}>Optimization control</h5>
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