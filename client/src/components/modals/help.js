import React from 'react';
import { Modal } from 'react-bootstrap';
import EmptyLGModal from './templates';

const HelpModal = props => (
    <EmptyLGModal {...props} title="How to use this application">
        <Modal.Body>
            <p>The dashboard is divided in three sections: configuration, control and results.</p>
            <p>In the <b>Experiment configuration</b> section, the status of the selected fitness functions
            models is shown together with them corresponding optimizers for each one. Here you can add 
            fitness functions, optimizers and configure every desired parameter depending on the purpose 
            of the experiment. The population status for the evolutionary optimizers can be expanded or
            collapsed using the control buttons on the top right corner of the optimizer block.</p>
            <p>In the <b>Experiment control</b> section, the number of rounds and iterations to run
            during the experiment can be configured. The higher the rounds and iterations numbers, the
            longer it will take to complete the experiment. Click on the green button to start the experiment
            or the red one to restart to the initial state. The experiment will run until it completes 
            the indicated number of rounds and iterations, or the total elapsed time exceeds the 
            default limit of five minutes.</p>
            <p>Finally, when the experiment ends, the results are displayed on the <b>Experiment 
            results</b> section, where it can be found a set of charts showing the results grouped
            by round or by optimizer.</p>
        </Modal.Body>  
    </EmptyLGModal>
);

export default HelpModal;