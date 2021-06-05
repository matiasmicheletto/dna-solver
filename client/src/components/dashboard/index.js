import React, { useState } from 'react';
import { Button } from 'react-bootstrap';
import FitnessSelect from './fitness_select';
import { fitness as fitness_type } from '../../manager';
import random_name from '../../tools/random_names';

const Dashboard = (props) => {

    const [f_type, setFType] = useState(fitness_type.TSP);
    const [list, setList] = useState([]);

    const run = () => {
        props.manager.add_fitness(f_type);
        setList([...props.manager.fitness]);
    }

    const fitnessSelection = e => {
        setFType(e.target.value);
    }

    return (
        <div>
            <FitnessSelect onChange={fitnessSelection} />
        
            <Button onClick={run}>Add</Button>
            
            {
                list.map( (f, ind) => (
                    <p key={ind}>{random_name()} -- {f.type}</p>
                ))
            }
        </div>
    );
}

export default Dashboard;