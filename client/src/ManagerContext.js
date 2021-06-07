import React, {createContext} from 'react';
import OptManager from './manager';

export const OMContext = createContext();

const om = new OptManager();

const OMProvider = props => (
    <OMContext.Provider value={om}>
        {props.children}
    </OMContext.Provider>
);

export default OMProvider;