import React, { useState, useContext } from 'react';
import { 
    Row, 
    Col, 
    Form, 
    Table, 
    Collapse,
    Button 
} from 'react-bootstrap';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import classes from './styles.module.css';
import { LoadingContext } from '../../context/LoadingContext';
import { distance } from '../../fitness/tsp';

/*
    TSPConfig Component
    -----------------------
    This component renders the problem description and the
    form that allows to configure the parameters of the 
    Travelling Salesman Problem.    
*/


const PlacesCollapsible = props => {
    const [open, setOpen] = useState(false);

    return (
        <div>
            <Row>
                <Col>
                    <Button 
                        variant="flat"
                        onClick={()=>setOpen(!open)}>
                        {
                            open ?                         
                            <div>
                                Hide cities table
                                <FaChevronUp />
                            </div>    
                            :
                            <div>
                                Show cities table
                                <FaChevronDown />
                            </div>
                        }
                    </Button>
                </Col>
            </Row>
            <Collapse in={open}>
                <Row>
                    <Table striped bordered hover responsive>
                        <thead>
                            <tr>
                                <th>City</th>
                                <th>X</th>
                                <th>Y</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                props.places.map( (p,ind) => 
                                    <tr key={ind}>
                                        <td>{ind+1}</td>
                                        <td>{p[0]}</td>
                                        <td>{p[1]}</td>
                                    </tr> 
                                )
                            }
                        </tbody>
                    </Table>
                </Row>
            </Collapse>
        </div>
    );
};

const WeightCollapsible = props => {

    const [open, setOpen] = useState(false);

    console.log(props.weight);

    return (
        <div>
            <Row>
                <Col>
                    <Button 
                        variant="flat"
                        onClick={()=>setOpen(!open)}>
                        {
                            open ?                         
                            <div>
                                Hide distances matrix
                                <FaChevronUp />
                            </div>    
                            :
                            <div>
                                Show distance matrix
                                <FaChevronDown />
                            </div>
                        }
                    </Button>
                </Col>
            </Row>
            <Collapse in={open}>
                <Row>
                    <Table striped bordered hover responsive>
                        <thead>
                            <tr>
                                <th></th>
                                {
                                    props.weight.map( (row, ind) => 
                                        <th key={ind}>{ind+1}</th>
                                    )
                                }
                            </tr>
                        </thead>
                        <tbody>
                            {
                                props.weight.map( (row,ind) => 
                                    <tr key={ind}>
                                        <td>{ind+1}</td>
                                        {
                                            row.map( (col, ind2) => 
                                                <td key={ind2}>{col.toFixed(2)}</td>
                                            )
                                        }
                                    </tr> 
                                )
                            }
                        </tbody>
                    </Table>
                </Row>
            </Collapse>
        </div>
    )
}


const TSPConfig = props => {
    
    // Configuration file format
    // In case of using json file, then, all the configuration should be provided by this file
    // When using csv, then all the other parameters should be specified.
    const [format, setFormat] = useState("json");

    // Preloader is used when loading .json or .csv data
    const {loading, setLoading} = useContext(LoadingContext);

    const parseJson = data => { // Get coordinate list from json data
        const content = JSON.parse(data);
        return content?.coords?.length > 0 ? content.coords : [];
    }

    const parseCsv = data => {
        return [];
    }

    const fileUploaded = event => {
        setLoading(true);
        const file = event.target.files[0];
        if(file){
            let reader = new FileReader();
            reader.onload = content => {
                let places = [];
                switch(format){
                    case "json":
                        places = parseJson(content.target.result);
                        break;
                    case "csv":
                        places = parseCsv(content.target.result);
                        break;
                    default:
                        places = [];
                }
                setLoading(false);
                if(places.length > 0)
                    props.configure({places: places});                
                else // TODO: An error toast should be shown here
                    console.log("Error when parsing file!");
            };
            reader.readAsText(file);
        }
    };

    return (
        <Form className={classes.Container}>
            <div className={classes.ProblemDesc}>
                <h5>Problem description</h5>
                <p>The <a href="https://en.wikipedia.org/wiki/Travelling_salesman_problem">Travelling Salesperson Problem (TSP)</a> asks
                the following question: "Given a list of cities and the distances between each pair of cities, what is the shortest 
                possible route that visits each city exactly once and returns to the origin city?" It is an NP-hard problem in 
                combinatorial optimization, important in theoretical computer science and operations research.</p>
            </div>
            <Row>
                <Col>
                    <Form.Group>
                        <Form.Label>Configuration file format</Form.Label>
                        <Form.Control as="select" onChange={v => setFormat(v.target.value)}>
                            <option value="json">JSON</option>
                            <option value="csv">CSV</option>
                        </Form.Control>
                    </Form.Group>
                </Col>
                <Col style={{marginTop:"auto", marginBottom:"auto"}}>
                    <Form.Group>
                        <Form.File id="File Form Control" onChange={v => fileUploaded(v)}/>
                    </Form.Group>
                </Col>
            </Row>
            <Row>
                <Form.Group>
                    <Form.Label>Distance function</Form.Label>
                    <Form.Control 
                        as="select" 
                        defaultValue={props.fitness.distance}
                        onChange={v=>props.configure({distance:v.target.value})}>
                        {
                           Object.keys(distance).map((d, ind) => (
                               <option key={ind} value={distance[d]}>{d}</option>
                           ))
                        }
                    </Form.Control>
                </Form.Group>
            </Row>
            <PlacesCollapsible places={props.fitness.places} />
            <WeightCollapsible weight={props.fitness.weight_matrix} />
        </Form>
    );
};

export default TSPConfig;