import React, { useContext } from 'react';
import { Row, Col } from 'react-bootstrap';
import classes from './styles.module.css';
import { OMContext } from '../../context/ManagerContext';
import LinePlot from '../plots/lineplot';

const Plotter = props => {

    const om = useContext(OMContext);            
    
    const results = om.results;
    let show = false;
    let best_hist_config = {
        title:"Fitness vs generation",
        yaxis:"Fitness value (average accross rounds)",
        xaxis:"Generation number",
        series:[]
    };
    if(results.ready){ // Check if there are results ready
        best_hist_config.series = Object.keys(results.by_optimizer).map(g => {
            return {
                name: results.by_optimizer[g].name,
                data: results.by_optimizer[g].best_hist,
                color: results.by_optimizer[g].color
            }
        });
        show = true;
    }
    
    return (
        show && <div className={classes.Container}>
            <h5>Experiment results</h5>
            <Row>
                <Col>
                    <LinePlot id="best_hist" config={best_hist_config}/>
                </Col>
            </Row>
        </div>
    );
}

export default Plotter;