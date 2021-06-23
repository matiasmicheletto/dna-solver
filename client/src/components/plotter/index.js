import React, { useContext } from 'react';
import { Row, Col, Table } from 'react-bootstrap';
import classes from './styles.module.css';
import { ExperimentCtx } from '../../context/ExperimentCtx';
import LinePlot from '../plots/lineplot';
import BarPlot from '../plots/barplot';

const Plotter = () => {

    const experiment = useContext(ExperimentCtx);            
    const results = experiment.results; // Only using results from the experiment manager
    
    // This component has no state, it does nothing but showing results,
    // So its "constant state" is updated outside, so it changes when
    // rendering.
    // The "show" property is used to enable or disable the output.
    let show = false; 
    // Each plot has a config, as they're general purpose figures.
    let best_hist_config = { // Line plot of best evolution
        title:"Best fitness",
        yaxis:"Fitness (average accross rounds)",
        xaxis:"Generation number",
        series:[]
    };

    let avg_hist_config = { // Line plot of avg fitness evolution
        title:"Population fitness average",
        yaxis:"Fitness (average accross rounds)",
        xaxis:"Generation number",
        series:[]
    };

    // The other figure is a barplot that sows some constant metrics
    let fitness_bar_config = { // Fitness evaluations number per round
        title:"Fitness evaluations by round",
        yaxis: "Fitness evaluations",
        categories:[], // Round number
        series:[]
    };
    let elapsed_bar_config = { // Elapsed time per round
        title:"Elapsed time by round",
        yaxis: "Elapsed (ms)",
        categories:[], // Round number
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
        avg_hist_config.series = Object.keys(results.by_optimizer).map(g => {
            return {
                name: results.by_optimizer[g].name,
                data: results.by_optimizer[g].avg_hist,
                color: results.by_optimizer[g].color
            }
        });
        
        results.by_round.forEach((r,ind) => {
            fitness_bar_config.categories.push(ind); // Push the round number
            if(ind === 0){ // First time, we create the series
                fitness_bar_config.series = Object.keys(r).map(g => {
                    return {
                        name: r[g].name,
                        data: [r[g].fitness_evals],
                        color: r[g].color
                    }
                });
                elapsed_bar_config.series = Object.keys(r).map(g => {
                    return {
                        name: r[g].name,
                        data: [r[g].elapsed],
                        color: r[g].color
                    }
                });
            }else{ // Then, we complete only with data 
                Object.keys(r).forEach((g_id,ind) => {
                    fitness_bar_config.series[ind].data.push(r[g_id].fitness_evals);
                    elapsed_bar_config.series[ind].data.push(r[g_id].elapsed);
                });                
            }
        });
        show = true;
    }
    
    return (
        show && <div className={classes.Container}>
            <h4>Experiment results</h4>
            <Row>
                <Col sm="12" md="6">
                    <LinePlot id="best_hist" config={best_hist_config}/>                    
                </Col>
                <Col sm="12" md="6">
                    <LinePlot id="avg_hist" config={avg_hist_config}/>                    
                </Col>
                <Col sm="12" md="6">
                    <BarPlot id="fitness_evals" config={fitness_bar_config}/>
                </Col>
                <Col sm="12" md="6">
                    <BarPlot id="elapsed" config={elapsed_bar_config}/>
                </Col>
            </Row>
            <Row>
                {
                    Object.keys(results.by_optimizer).map(g => (
                        <Col xl style={{marginBottom:"15px"}}>
                            <div style={{backgroundColor: results.by_optimizer[g].color}} className={classes.ResultCard}>
                                <h5>{results.by_optimizer[g].name}</h5>
                                <Table striped bordered hover responsive>
                                    <tbody>
                                        <tr>
                                            <td><b>Fitness evaluations (average):</b></td>
                                            <td>{results.by_optimizer[g].avg_fitness_evals.toFixed(3)}</td>
                                        </tr>
                                        <tr>
                                            <td><b>Round elapsed time:</b></td>
                                            <td>{results.by_optimizer[g].avg_elapsed.toFixed(3)} ms.</td>
                                        </tr>
                                        <tr>
                                            <td><b>Best fitness (average):</b></td>
                                            <td>{results.by_optimizer[g].avg_best_fitness.toFixed(3)}</td>
                                        </tr>
                                        <tr>
                                            <td><b>Best fitness (all rounds):</b></td>
                                            <td>{results.by_optimizer[g].abs_best_fitness.toFixed(3)}</td>
                                        </tr>
                                        <tr>
                                            <td><b>Best solution (all rounds):</b></td>
                                            <td>{results.by_optimizer[g].abs_best_solution}</td>
                                        </tr>
                                        <tr>
                                            <td><b>Best objective (all rounds):</b></td>
                                            <td>{results.by_optimizer[g].abs_best_objective}</td>
                                        </tr>
                                    </tbody>
                                </Table>
                            </div>
                        </Col>
                    ))
                }
            </Row>
        </div>
    );
}

export default Plotter;

