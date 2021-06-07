import React from 'react';
import { Form } from 'react-bootstrap';
import { fitness as fitness_type } from '../../manager';

const FitnessSelect = props => {
    return (
        <Form>
            <Form.Group controlId="exampleForm.ControlSelect1">
                <Form.Label>Fitness Function Selector</Form.Label>
                <Form.Control as="select" onChange={props.onChange}>
                {
                    Object.keys(fitness_type).map((f, ind) => (
                        <option key={ind}>{fitness_type[f]}</option>
                    ))
                }
                </Form.Control>
            </Form.Group>
        </Form>
    )
}

export default FitnessSelect;