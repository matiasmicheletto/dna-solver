import React from 'react';
import { fitness_types } from '../../experiment/index.mjs';
import TSPConfig from './tspconfig';
import NQueensConfig from './nqueensconfig';
import QuadraticConfig from './quadraticconfig';

/*
    FitnessConfig Component
    ----------------------
    This is a HOC that returns the config form component
    depending on the fitness type given.
*/

const FitnessConfig = props => {
    let component;

    switch(props.fitness.type){
        case fitness_types.TSP:
            component = <TSPConfig {...props}/>;
            break;
        case fitness_types.NQUEENS:
            component = <NQueensConfig {...props}/>;
            break;
        case fitness_types.QUADRATIC:
            component = <QuadraticConfig {...props}/>;
            break;
        default:
            component = (
                <div>
                    <p>This fitness model has not configurable parameters.</p>
                </div>
            )
            break;
    }

    return component;
};

export default FitnessConfig;