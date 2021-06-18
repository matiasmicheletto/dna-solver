import React, { useState } from 'react';
import { Form, InputGroup } from 'react-bootstrap';
import classes from './styles.module.css';

/*
    NQueensConfig Component
    -----------------------
    This component renders the problem description and the 
    form required to configure all of the N-Queens fitness 
    model parameters, which is just "N", the chessboard 
    size or queens number.
*/

// Fixed value for now, but the default number should be 
// imported from module
const default_N = 8; 

const NQueensConfig = props => {
    
    const [config, setConfig] = useState({N:default_N}); 

    const updateConfig = n => {
        props.configure({N:n});
        setConfig({N:n});
    }

    return (
        <Form className={classes.Container}>
            <div className={classes.ProblemDesc}>
                <h5>Problem description</h5>
                <p>The {config.N}-queens puzzle is the problem of placing {config.N} chess queens on an {config.N}x{config.N} chessboard 
                so that no two queens threaten each other; thus, a solution requires that no 
                two queens share the same row, column, or diagonal.</p>
                <p>Candidate solutions are encoded using arrays of {config.N} elements where each element 
                corresponds to each column and its value indicates the row occupied by the queen of that 
                column.</p>
            </div>
            <InputGroup>
                <InputGroup.Text>Chessboard Size</InputGroup.Text>
                <Form.Control
                    type="number"
                    placeholder="Chessboard size"
                    min="4"
                    max="100"
                    defaultValue={default_N}
                    onChange={v => updateConfig(parseInt(v.target.value))}
                >
                </Form.Control>
            </InputGroup>
        </Form>
    );
};

export default NQueensConfig;