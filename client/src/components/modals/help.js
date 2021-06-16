import React from 'react';
import { Modal } from 'react-bootstrap';
import EmptyLGModal from './templates';

const HelpModal = props => (
    <EmptyLGModal {...props} title="How to use this application">
        <Modal.Body>
            <h5>General view</h5>
            <p>The dashboard is divided in three sections: configuration, control and results.</p>
            <p>In the <b>Experiment configuration</b> section, the status of the selected fitness functions
            models is shown together with the corresponding optimizers for each one. Here you can add 
            fitness functions, optimizers and configure every desired parameter depending on the purpose 
            of the experiment. The population status and configuration forms for the evolutionary optimizers 
            can be expanded or collapsed using the control buttons on the top right corner of the optimizer 
            block. The optimizers' initial names are random, but you can edit this string by clicking over
            the name.</p>
            <p>In the <b>Experiment control</b> section, the number of rounds and iterations to run
            during the experiment can be configured. The higher the rounds and iterations numbers, the
            longer it will take to complete the experiment. Click on the green button to start the experiment
            or the red one to restart to the initial state. The experiment will run until it completes 
            the indicated number of rounds and iterations, or the total elapsed time exceeds the 
            default limit of five minutes.</p>
            <p>Finally, when the experiment ends, the results are displayed on the <b>Experiment 
            results</b> section, where it can be found a set of charts showing the results grouped
            by round or by optimizer.</p>
            <h5>Fitness functions models</h5>
            <p>Fitness functions models should be defined by coding the entire module. A fitness parent class
            is provided in order to ease the compatibility with the experiment and optimizers class.</p>
            <p>The modules should be configurable by the user. Three models are provided to create experiments:</p>
            <ul>
                <li>
                    <b>Parabolic Optimization</b>: a simple parabolic function that encode its optimization variable
                    as binary strings. In this case, the bitstring length is the only configurable parameter.
                </li>
                <li>
                    <b>N-Queen Problem</b>: The problem consist on finding a way of placing N queens on a NxN chess
                    board so that no two queens threaten each other; thus, a solution requires that no two queens share 
                    the same row, column, or diagonal. Candidate solutions are encoded using arrays of N elements
                    where each element corresponds to  each column and its value indicates the row occupied by the 
                    queen of that column. The value of N is the only configurable parameter.
                </li>
                <li>
                    <b>Travelling Salesperson Problem</b>: The <a href="https://en.wikipedia.org/wiki/Travelling_salesman_problem">
                    Travelling Salesperson Problem (TSP)</a> asks the following question: "Given a list of cities and 
                    the distances between each pair of cities, what is the shortest possible route that visits each city 
                    exactly once and returns to the origin city?" It is an NP-hard problem in combinatorial optimization, 
                    important in theoretical computer science and operations research.
                </li>
            </ul>

            <h5>Optimizers parameters</h5>
            <ul>
                <li>
                    <b>Population size:</b> Number of individuals of the optimizer, also noted <i>pop_size</i>.
                </li>
                <li>
                    <b>Elite individuals:</b> Number of top ranked individuals that are preserved until
                    the next generation.
                </li>
                <li>
                    <b>Selection operator:</b> Method used to select the pairs of individuals that will
                    be crossovered to obtain the offspring. There are three options:
                    <ul>
                        <li>
                            <b>Roulette:</b> each individual <i>i</i> is selected with a probability of P<sub>i</sub>=f<sub>i</sub>/F 
                            where f<sub>i</sub> is its fitness value and F=&sum;f (the sum of the fitness values for 
                            the entire population).
                        </li>
                        <li>
                            <b>Ranking:</b> each individual <i>i</i> is selected with probability P<sub>i</sub>=q-i*r, where:
                            <br></br>
                            q=r(<i>pop_size</i>-1)/2+1/<i>pop_size</i>
                            <br></br>
                            and r is a tunning parameter that should guarantee that 0 &le; P<sub>i</sub> &le; P<sub>i</sub>.
                        </li>
                        <li>
                            <b>Tournament:</b> <i>pop_size</i> groups of <i>k</i> randomly selected individuals is generated and
                            the top ranked individual of each group is selected.
                        </li>
                    </ul>
                </li>
                <li>
                    <b>Crossover operator:</b> determines the algorithm to follow in order to obtain two children or offspring from
                    two original parent individuals. There are three options:
                    <ul>
                        <li>
                            <b>Single point:</b> a random point is selected in the genotype array, and children are 
                            obtained by swapping the first and last part of their parents.
                        </li>
                        <li>
                            <b>Double point:</b> similar as before, but genotypes are cut in two random points.
                        </li>
                        <li>
                            <b>PMX:</b> the <i>Partially Mapped Crossover</i> operator is based on the work from
                            Goldberg and Lingle (1985).
                        </li>
                    </ul>
                </li>
                <li>
                    <b>Crossover probability:</b> determines the probability of a pair of selected individuals to be
                    combined to obtain an offspring pair of children.
                </li>
                <li>
                    <b>Mutation operator:</b> defines the algorithm that alteres one or more genes or alleles from an individual.
                    There are three available operators:
                    <ul>
                        <li>
                            <b>Bitflip</b>: for binary encoded functions, the selected allele value is switched, that is, if
                            its original value was 1, then it is converted to a 0, and viceversa.
                        </li>
                        <li>
                            <b>Rand</b>: the selected allele for mutation is modified by a random value.
                        </li>
                        <li>
                            <b>Swap</b>: in this case, two alleles are selected and their positions are swapped.
                        </li>
                    </ul>
                </li>
                <li>
                    <b>Mutation probability:</b> indicates the probability of a single gen or allele to be randomly altered.
                </li>
                <li>
                    <b>Mutation proportion:</b> determines the proportion of the entire population that is affected by mutation
                    on every generation.
                </li>
            </ul>
        </Modal.Body>  
    </EmptyLGModal>
);

export default HelpModal;