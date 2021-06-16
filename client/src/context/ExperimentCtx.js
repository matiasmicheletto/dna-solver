import React, {createContext} from 'react';
import Experiment from '../experiment/index.mjs';

export const ExperimentCtx = createContext();

const experiment = new Experiment();

const ExperimentProvider = props => (
    <ExperimentCtx.Provider value={experiment}>
        {props.children}
    </ExperimentCtx.Provider>
);

export default ExperimentProvider;