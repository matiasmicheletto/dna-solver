import React from 'react';
import { Form } from 'react-bootstrap';
import { fitness_types, fitness_names } from '../../manager';

const FitnessSelect = props => {
    return (
        <Form>
            <Form.Group>
                <Form.Control as="select" onChange={props.onChange}>
                {
                    Object.keys(fitness_types).map((f, ind) => (
                        <option key={ind} value={fitness_types[f]}>{fitness_names[f]}</option>
                    ))
                }
                </Form.Control>
            </Form.Group>
        </Form>
    );
}

export default FitnessSelect;