import React, {createContext} from 'react';
import OptManager from '../manager/index.mjs';

export const OMContext = createContext();

const om = new OptManager();

/*
let ids = [];
ids.push(om.add_fitness());
ids.push(om.add_fitness());
om.add_ga(ids[0]);
om.add_ga(ids[0]);
om.add_ga(ids[0]);
om.add_ga(ids[1]);
om.add_ga(ids[1]);
*/

const OMProvider = props => (
    <OMContext.Provider value={om}>
        {props.children}
    </OMContext.Provider>
);

export default OMProvider;