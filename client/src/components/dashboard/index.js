import React, {useState} from 'react';
import './styles.css';

const Dashboard = (props) => {
    
    const [gen, setGen] = useState(0);
    const [pop, setPop] = useState([]);

    const go = () => {
        props.ga.evolve();
        setGen(props.ga.generation);
        setPop(props.ga.status.population);
    }

    return (
        <div>
            <p>Current generation: {gen}</p>
            <button onClick={go}>Evolve!</button>
            <br></br>
            <br></br>
            <table className="table">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Genotype</th>
                        <th>Phenotype</th>
                        <th>Fitness</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        pop.map( (p,ind) => 
                            <tr key={ind}>
                                <td>{ind+1}</td>
                                <td>{p.genotype}</td>
                                <td>{p.phenotype}</td>
                                <td>{p.fitness}</td>
                            </tr> 
                        )
                    }
                </tbody>
            </table>
        </div>
    )
}

export default Dashboard;