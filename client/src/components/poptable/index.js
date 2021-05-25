import React from 'react';

const PopTable = (props) => {
    return (
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
                    props.pop.map( (p,ind) => 
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
    )
}

export default PopTable;
