import React, {useState} from 'react';

const Dashboard = (props) => {
    
    const [gen, setGen] = useState(0);

    const go = () => {
        props.ga.evolve();
        setGen(props.ga.generation);
    }

    return (
        <div>
            <p>Current generation: {gen}</p>
            <button onClick={go}>Evolve!</button>
        </div>
    )
}

export default Dashboard