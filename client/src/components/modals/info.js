import React from 'react';
import EmptyLGModal from './templates';

const InfoModal = props => (
    <EmptyLGModal {...props} title="About this software">
        <p>This is a NodeJS and ReactJS based web application that allows to create and 
            test evolutionary algorithms experiments with focus on hyperparametric optimization 
            for solving the most common problems present in the combinatorial optimization literature.</p>
        <p>This project was developed under the context of the final work for the posgraduate 
        course <i>"Advanced Techniques for Evolutionary Computation"</i> by
        <a href="https://cs.uns.edu.ar/~ip/" target="_blank" rel="noopener noreferrer"> Dr. Ignacio Ponzoni</a> at 
        <a href="https://cs.uns.edu.ar/~devcs/" target="_blank" rel="noopener noreferrer"> DCIC (UNS)</a>.</p>
        <br />
        <p><b>Author:</b> <a href="http://matiasmicheletto.github.io" target="_blank" rel="noopener noreferrer">Dr. Matías Micheletto</a></p>
        <p><b>Source code:</b> <a href="https://github.com/matiasmicheletto/dna-solver" target="_blank" rel="noopener noreferrer">https://github.com/matiasmicheletto/dna-solver</a></p>
        <p><b>License: </b> GPL-3.0</p>
        <br />
        <div style={{fontSize:10}}>
            <p><b>Terms and conditions</b></p>
            <p>This program is free software: you can redistribute it and/or modify it under the 
            terms of the GNU General Public License as published by the Free Software Foundation, 
            either version 3 of the License.</p>
            <p>This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; 
            without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. 
            See the GNU General Public License for more details. You should have received a copy of the 
            GNU General Public License along with this program. If not, see 
            <a href="http://www.gnu.org/licenses" target="_blank" rel="noopener noreferrer">http://www.gnu.org/licenses</a>.</p>
        </div>
    </EmptyLGModal>
);

export default InfoModal;