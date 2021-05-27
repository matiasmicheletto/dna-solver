import React from 'react';
import { Table } from 'react-bootstrap';

const PopTable = (props) => {

    return (
        <Table striped bordered hover>
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
                    props.pop.map( (p,ind) => 
                        <tr key={ind}>
                            <td>{ind+1}</td>
                            <td>{p.genotype}</td>
                            <td>{p.phenotype}</td>
                            <td>{p.fitness.toFixed(2)}</td>
                        </tr> 
                    )
                }
            </tbody>
        </Table>
    )
}

export default PopTable;
