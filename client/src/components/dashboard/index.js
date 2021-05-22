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
            <br></br>
            <br></br>
            {gen > 5 && <p>Yeah, this ain't much, but check out the source code to see what's going on</p>}
        </div>
    )
}

export default Dashboard;