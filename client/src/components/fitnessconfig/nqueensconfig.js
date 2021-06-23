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
    For now this component configure almos everything and
    handles its own state with the fitness parameters
    but everything will be moved to the experiment manager
    and the fitnessitem component will handle the rendering
*/

const NQueensConfig = props => (
    <Form className={classes.Container}>
        <div className={classes.ProblemDesc}>
            <h5>Problem description</h5>
            <p>The {props.fitness.N}-queens puzzle is the problem of placing {props.fitness.N} chess queens on an {props.fitness.N}x{props.fitness.N} chessboard 
            so that no two queens threaten each other; thus, a solution requires that no 
            two queens share the same row, column, or diagonal.</p>
            <p>Candidate solutions are encoded using arrays of {props.fitness.N} elements where each element 
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
                defaultValue={props.fitness.N}
                onChange={v => props.configure({N: parseInt(v.target.value)})}
            >
            </Form.Control>
        </InputGroup>
    </Form>
);

export default NQueensConfig;