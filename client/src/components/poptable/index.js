import React from 'react';
import { Table } from 'react-bootstrap';
import SolutionViewer from '../solutionviewer';

const cellStyle = {
    whiteSpace: "nowrap", 
    textOverflow: "ellipsis", 
    overflow: "hidden", 
    maxWidth:"150px"
};

const PopTable = props => (
    <Table striped bordered hover responsive>
        <thead>
            <tr style={{textAlign:"center"}}>
                <th>#</th>
                <th>Genotype</th>
                <th>Phenotype</th>
                <th>Fitness</th>
                <th>Objective</th>
            </tr>
        </thead>
        <tbody>
            {
                props.ga.population.map( (p,ind) => 
                    <tr key={ind} style={{textAlign:"center"}}>
                        <td>{ind+1}</td>
                        <td style={cellStyle}>{p.genotype}</td>
                        <td style={cellStyle}><SolutionViewer genotype={p.genotype} fitness={props.ga.fitness}/></td>
                        <td>{p.fitness.toFixed(2)}</td>
                        <td>{p.objective.toFixed(2)}</td>
                    </tr> 
                )
            }
        </tbody>
    </Table>
);

export default PopTable;