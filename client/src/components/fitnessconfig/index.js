import React from 'react';

import QuadraticConfig from './quadraticconfig';
import SubsetSumConfig from './subsetsumconfig';
import NQueensConfig from './nqueensconfig';
import KnapsackConfig from './knapsackconfig';
import TSPConfig from './tspconfig';

import Quadratic from 'optimization/fitness/quadratic.mjs';
import SubsetSum from 'optimization/fitness/subsetsum.mjs';
import NQueens from 'optimization/fitness/nqueens.mjs';
import Knapsack from 'optimization/fitness/knapsack.mjs';
import Tsp from 'optimization/fitness/tsp.mjs';


/*
    FitnessConfig Component
    ----------------------
    This is a HOC that returns the config form component
    depending on the fitness class.
    This makes an abstraction between react components and
    fitness models
*/

const FitnessConfig = props => {

    if(props.fitness instanceof Quadratic)
        return <QuadraticConfig {...props} />

    if(props.fitness instanceof SubsetSum)
        return <SubsetSumConfig {...props} />

    if(props.fitness instanceof NQueens)
        return <NQueensConfig {...props} />

    if(props.fitness instanceof Knapsack)
        return <KnapsackConfig {...props} />

    if(props.fitness instanceof Tsp)
        return <TSPConfig {...props} distance={Tsp.distance} />

    return (
        <div>
            <p>This fitness model has not configurable parameters.</p>
        </div>
    );
};

export default FitnessConfig;