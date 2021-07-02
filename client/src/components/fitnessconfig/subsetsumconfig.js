import React, { useContext, useRef } from 'react';
import { Form, Button, InputGroup } from 'react-bootstrap';
import classes from './styles.module.css';
import { LoadingContext } from '../../context/LoadingContext';

/*
    SubsetSumConfig Component
    -----------------------
    This component renders the problem description and the 
    form required to configure all of the subset sum fitness 
    model parameters, which is the set of numbers that should
    be imported from a correctly formatted csv file.
*/

const SubsetSumConfig = props => {    
    // Preloader is used when loading .csv data
    const {loading, setLoading} = useContext(LoadingContext);

    // To customize the file input, we use refs to trigger the click event from other buttons
    const fileInputEl = useRef(null);

    const fileUploaded = (file) => {                
        if(file){
            setLoading(true);
            let reader = new FileReader();
            reader.onload = content => {                
                const data = content.target.result.split(',').map(el=>parseInt(el));
                props.configure({set: data});   
                setLoading(false);
            };
            reader.readAsText(file);
        }
    };

    return (
        <Form className={classes.Container}>
            <div className={classes.ProblemDesc}>
                <h5>Problem description</h5>
                <p> The <a href="https://en.wikipedia.org/wiki/Subset_sum_problem" target="_blank" rel="noopener noreferrer">Subset
                Sum Problem</a> consist on finding a subset of a given set of integer numbers which sum equals to a target sum T.
                In large sets, it is also possible that multiple combinations yields to the same sum, so, the fitness model will
                take into account the number of selected elements for the subset as a cost in the fitness.</p>
                <InputGroup>
                    <InputGroup.Text>Target sum value</InputGroup.Text>
                    <Form.Control
                        type="number"
                        placeholder="Target sum"                        
                        defaultValue={props.fitness.T}
                        onChange={v => props.configure({T: parseInt(v.target.value)})}
                    >
                    </Form.Control>
                </InputGroup>
                <br/>
                <p>Current numeric set is: </p>
                <p>{props.fitness.set.join(", ")}</p>
                <p>In order to use a different numeric set, a single line <b>.csv</b> file can be provided. Numbers should be comma separated
                integers (or download an example from this <a href="examples/ssp">link</a>).</p>
                <Form.Group>                        
                    <input                             
                        type="file"                             
                        ref={fileInputEl} 
                        style={{display:"none"}} 
                        onChange={v => fileUploaded(v.target.files[0])}/>
                    <Button onClick={()=>fileInputEl.current?.click()}>Upload numeric set file...</Button>
                </Form.Group>
            </div>
        </Form>
    );
};

export default SubsetSumConfig;