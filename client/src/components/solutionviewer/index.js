import React, { useState, useRef } from 'react';
import EmptyLGModal from '../modals/templates';

import TspSolutionViewer from './tspsolutionviewer';
import NQueensSolutionViewer from './nqueenssolutionviewer';

import Tsp from '../../fitness/tsp.mjs';
import NQueens from '../../fitness/nqueens.mjs';
import Quadratic from '../../fitness/quadratic.mjs';


/*
    SolutionViewer Component
    ----------------------
    This is a HOC that returns the visualizer method that
    displays a phenotype accordingly.
    By default this method returns an inline a string with 
    a modal that pops up on click showing the solution
    representation.
    This makes an abstraction between react components and
    fitness models.
*/

const ViewerSwitcher = props => {
    if(props.fitness instanceof Tsp)
        return <TspSolutionViewer {...props} />
    if(props.fitness instanceof NQueens)
        return <NQueensSolutionViewer {...props} />

    return (
        <div>
            No viewer model provided!
        </div>
    );
};

const SolutionViewer = props => {
    const [show, setShow] = useState(false);

    const maxlen = props.maxlen ? props.maxlen : 25;

    return (
        <span style={{cursor:"pointer"}} onClick={()=>setShow(!show)}>            
            {// Crop string at 25 characters}
                props.genotype.join("-").substr(0,maxlen)+(props.genotype.length > maxlen ? "...":"") 
            }
            <EmptyLGModal show={show} title="Solution" onHide={()=>{}}>
                <ViewerSwitcher fitness={props.fitness} data={props.genotype}/>
            </EmptyLGModal>            
        </span>
    );
};

export default SolutionViewer;