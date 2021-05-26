import React, {useState} from 'react';
import PopTable from '../poptable';

const Dashboard = (props) => {

    const [gen, setGen] = useState(0);
    const [ffe, setFFE] = useState(0);
    const [pop, setPop] = useState(props.ga.status.population);
    const [limit, setLimit] = useState(100);
    
    const go = () => { // Execute a single step of the algorithm and render
        props.ga.evolve()
        const s = props.ga.status; // To avoid run the getter multiple times
        setGen(props.ga.generation);
        setFFE(s.fitness_evals)
        setPop(s.population);
    }

    const fast_fw = () => { // FFW button callback
        if(props.ga.generation < limit)
            setTimeout(()=>{ // When using timeout, a render is performed on every loop
                go();
                fast_fw();
            }, 10);
        else 
            setLimit(limit+100); // Increase limit for next 100 generations
    }

    return (
        <div>
            <p>Fitness function is <b>y = (x-181)<sup>2</sup></b> for <b>x</b> in range <b>(0..65535)</b>.</p> 
            <p>Hit the <i>Evolve!</i> button and let the algorithm find the value of <b>x</b> (column phenotype) that minizes the fitness function <b>y</b>.</p>
            <br></br>
            <p><b>Current generation:</b> {gen}</p>
            <p><b>Objective function evaluations:</b> {ffe}</p>
            <button onClick={go} title="Next generation">Evolve!</button>
            <button onClick={fast_fw} title="Advance 100 generations">Fast forward</button>
            <br></br>
            <br></br>
            <PopTable pop={pop} />
        </div>
    )
}

export default Dashboard;