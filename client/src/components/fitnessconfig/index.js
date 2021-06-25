import React from 'react';
import { fitness_types } from '../../experiment/index.mjs';
import TSPConfig from './tspconfig';
import NQueensConfig from './nqueensconfig';
import QuadraticConfig from './quadraticconfig';

import TSP from '../../fitness/tsp.mjs';

/*
    FitnessConfig Component
    ----------------------
    This is a HOC that returns the config form component
    depending on the fitness type given.
*/

const FitnessConfig = props => {
    let component;

    console.log(props.fitness.type);
    console.log(props.fitness instanceof TSP);

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