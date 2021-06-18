import React, { useState } from 'react';
import { Form, InputGroup } from 'react-bootstrap';
import classes from './styles.module.css';
import { get_params } from '../../fitness/quadratic.mjs';

/*
    QuadraticConfig Component
    -----------------------
    This component renders the problem description and the
    form that allows to configure the parameters of the 
    quadratic fitness function.
*/

const default_a = 1000;
const default_nbit = 10;
const default_params = get_params(default_nbit, default_a);
const default_config = {
    a: default_a, 
    z1: default_params[0],
    b: default_params[1], 
    c: default_params[2], 
    nbit: default_nbit
};

const QuadraticConfig = props => {
    const [config, setConfig] = useState(default_config); 

    const updateConfig = conf => {
        const p = get_params(conf.nbit, conf.a);
        setConfig({a:conf.a, b:p[1], c:p[2], z1: p[0], nbit: conf.nbit});
        props.configure(conf);
    }

    return (
        <Form className={classes.Container}>
            <div className={classes.ProblemDesc}>
                <h5>Problem description</h5>
                <p>Fitness function is a parabola given by <b>y = a - (x-c)<sup>2</sup>/b</b>. From calculus 
                we know that the maximum value that the function can reach is <b>a</b>, so given this value 
                and the number of encoding bits, the parameters <b>b</b> and <b>c</b> can be adjusted in 
                order to obtain a positive fitness function for the encoded range <b>000...0</b> to <b>111...1</b>.</p>
                <p>The current configuration give us the function <b>y = {config.a}-(x-{config.c})<sup>2</sup>/{(1/config.b).toFixed(2)}</b> for <b>x</b> in range <b>(0..{config.z1+1})</b>.</p>
            </div>
            <InputGroup>
                <InputGroup.Text>Bitstring length</InputGroup.Text>
                <Form.Control
                    type="number"
                    placeholder="Bitstring lenght"
                    min="4"
                    max="32"
                    defaultValue={default_nbit}
                    onChange={v => updateConfig({a: config.a, nbit: parseInt(v.target.value)})}
                >
                </Form.Control>
                <InputGroup.Text>Maximum fitness</InputGroup.Text>
                <Form.Control
                    type="number"
                    placeholder="Maximum fitness"
                    min="10"
                    max="10000"
                    step="10"
                    defaultValue={default_a}
                    onChange={v => updateConfig({a: parseInt(v.target.value), nbit:config.nbit})}
                >
                </Form.Control>
            </InputGroup>
        </Form>
    );
};

export default QuadraticConfig;