import React from 'react';

import TSPConfig from './tspconfig';
import NQueensConfig from './nqueensconfig';
import QuadraticConfig from './quadraticconfig';

import Tsp from '../../fitness/tsp.mjs';
import NQueens from '../../fitness/nqueens.mjs';
import Quadratic from '../../fitness/quadratic.mjs';

/*
    FitnessConfig Component
    ----------------------
    This is a HOC that returns the config form component
    depending on the fitness class.
    This makes an abstraction between react components and
    fitness models
*/

const FitnessConfig = props => {

    if(props.fitness instanceof Tsp)
        return <TSPConfig {...props}/>

    if(props.fitness instanceof NQueens)
        return <NQueensConfig {...props}/>

    if(props.fitness instanceof Quadratic)
        return <QuadraticConfig {...props}/>

    return (
        <div>
            <p>This fitness model has not configurable parameters.</p>
        </div>
    );
};

export default FitnessConfig;