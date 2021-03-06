import React, { useState } from 'react';
import EmptyLGModal from '../modals/templates';

import QuadraticSolutionViewer from './quadraticsolutionviewer';
import NQueensSolutionViewer from './nqueenssolutionviewer';
import TspSolutionViewer from './tspsolutionviewer';

import Quadratic from 'optimization/fitness/quadratic.mjs';
import SubsetSum from 'optimization/fitness/subsetsum.mjs';
import NQueens from 'optimization/fitness/nqueens.mjs';
import Knapsack from 'optimization/fitness/knapsack.mjs';
import Tsp from 'optimization/fitness/tsp.mjs';


/*
    SolutionViewer Component
    ----------------------
    This component returns the visualizer method that
    displays a phenotype in a graphical way.
    By default this method returns the dash-separated elements
    of the genotype as an inline a string (to embed in text).
    This makes an abstraction between react components and
    fitness models.
*/

const withinModal = ViewerComponent => {
    // This HOC allows to display the string with the text 
    // solution and a modal that pops up with the
    // graphical solution when the string is clicked on.
    return props => {
        const [show, setShow] = useState(false); // Modal state
        
        return (
            <span style={{cursor:"pointer"}} onClick={()=>setShow(!show)}>            
                {props.phenotype}
                <EmptyLGModal show={show} title="Phenotype graphical representation" onHide={()=>{}}>
                    <ViewerComponent {...props} />
                </EmptyLGModal>            
            </span>
        );
    };
};

// Function to crop strings
const str_crop = (str, maxlen) => str.substr(0,maxlen) + (str.length > maxlen ? "...":"");

const SolutionViewer = props => {

    // By default, phenotype is a dash-separated elements of the genotype array    
    let phenotype = props.genotype.join("-"); // Convert to string

    // Default viewer for fitness models without a defined visualizer
    let Viewer = props => <span title={props.phenotype}>{str_crop(props.phenotype, props.maxlen ? props.maxlen : 25)}</span>

    // The following logic determines which component use to display the
    // graphical representation of the phenotype
    
    if(props.fitness instanceof SubsetSum || props.fitness instanceof Knapsack)
        // For the subset sum and knapsack problem, just display the selected numbers
        phenotype = props.fitness.decode(props.genotype);
    
    if(props.fitness instanceof Quadratic){
        // In this case, the phenotype is the conversion BCD to Decimal
        phenotype = props.fitness.decode(props.genotype).toFixed(2);
        Viewer = withinModal(QuadraticSolutionViewer);
    }
    
    if(props.fitness instanceof NQueens)
        Viewer = withinModal(NQueensSolutionViewer);

    if(props.fitness instanceof Tsp)
        Viewer = withinModal(TspSolutionViewer);

    return <Viewer {...props} phenotype={phenotype} />;
};

export default SolutionViewer;