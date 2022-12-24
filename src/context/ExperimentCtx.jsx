import React, {createContext} from 'react';
import Experiment from 'optimization/experiment/index.mjs';

export const ExperimentCtx = createContext();

const experiment = new Experiment();

const ExperimentProvider = props => (
    // TODO: use state to dispatch GUI updates on experiment changes
    <ExperimentCtx.Provider value={experiment}>
        {props.children}
    </ExperimentCtx.Provider>
);

export default ExperimentProvider;