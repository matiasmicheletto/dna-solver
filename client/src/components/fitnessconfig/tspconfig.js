import React, { useState, useContext, useRef, useEffect } from 'react';
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
import { distance } from 'optimization/fitness/tsp.mjs';
import { csv2Array } from 'optimization/tools/index.mjs';


const MapViewer = props => {
    const canvasRef = useRef(null);        

    useEffect(() => {                

        const canvas = canvasRef.current;
        // Fixed dimensions
        const cw = canvas.width = 500;
        const ch = canvas.height = 250;
        const ctx = canvas.getContext("2d");         
        
        const places = props.places;
        
        // Draw positions as filled circles
        for(let p = 0; p < places.length; p++){            
            const posx = (places[p][0]*.9 + .05)*cw;
            const posy = (places[p][1]*.9 + .05)*ch;
            ctx.beginPath();
            ctx.arc(posx, posy, 5, 0, 2 * Math.PI); 
            ctx.fill();
            ctx.strokeText(p,posx+6,posy+6);
        }
        
        // Draw paths in order
        if(props.paths){
            ctx.strokeStyle = "red";
            ctx.beginPath();
            for(let p = 0; p < places.length; p++){            
                const posx = (places[p][0]*.9 + .05)*cw;
                const posy = (places[p][1]*.9 + .05)*ch;
                ctx.lineTo(posx, posy);
            }
            // Return to origin
            const xo = (places[0][0]*.9 + .05)*cw;
            const yo = (places[0][1]*.9 + .05)*ch;
            ctx.lineTo(xo, yo);
            ctx.stroke();
        }
    });

    return(
        <center>
            <canvas ref={canvasRef} style={{width:"100%"}}></canvas>
        </center>
    );
}

const PlacesTable = props => ( // Table for listing the coordinates
    <Table striped bordered hover responsive>
        <thead>
            <tr>
                <th>Place</th>
                <th>X</th>
                <th>Y</th>
            </tr>
        </thead>
        <tbody>
            {
                props.places.map( (p,ind) => 
                    <tr key={ind}>
                        <td>{ind+1}</td>
                        <td>{p[0].toFixed(2)}</td>
                        <td>{p[1].toFixed(2)}</td>
                    </tr> 
                )
            }
        </tbody>
    </Table>
);

const WeightMatrixTable = props => ( // Table for showing the weight matrix of destinations graph
    <Table striped bordered hover responsive>
        <thead>
            <tr>
                <th></th>
                {props.weights.map( (row, ind) => <th key={ind}>{ind+1}</th>)}
            </tr>
        </thead>
        <tbody>
            {
                props.weights.map( (row,ind) => 
                    <tr key={ind}>
                        <td><b>{ind+1}</b></td>
                        {row.map( (col, ind2) => <td key={ind2}>{col !== 0 ? col.toFixed(2) : "-"}</td>)}
                    </tr> 
                )
            }
        </tbody>
    </Table>
);

// This component renders the collapsible tables for places and weight matrix
const Collapsible = props => {
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
                                Hide {props.name}
                                <FaChevronUp />
                            </div>    
                            :
                            <div>
                                Show {props.name}
                                <FaChevronDown />
                            </div>
                        }
                    </Button>
                </Col>
            </Row>
            <Collapse in={open}>
                <Row>
                    {props.places && <PlacesTable {...props} />}
                    {props.weights && <WeightMatrixTable {...props} />}
                </Row>
            </Collapse>
        </div>
    );
};



/*
    TSPConfig Component
    -----------------------
    This component renders the problem description and the
    form that allows to configure the parameters of the 
    Travelling Salesman Problem.    
*/


const TSPConfig = props => {
    // Preloader is used when loading .json or .csv data
    const {loading, setLoading} = useContext(LoadingContext);

    // To customize the file inputs, we use refs to trigger the click event from other buttons
    const configInputEl = useRef(null);
    const placesInputEl = useRef(null);
    const weightsInputEl = useRef(null);
    

    // The following functions should be moved to the TSP module
    const parseJson = data => { // Get coordinate list from json data
        let config = {};
        let content = {};
        try{
            content = JSON.parse(data);
        } catch(e) { // TODO show toast
            console.log("Error while parsing the json file.");
        }
        const name = content.name;
        const places = content?.coords?.length > 0 ? content.coords : [];
        const dist = content.distance;
        if(places.length > 0 && dist in distance){ // Controls coords vector and distance function
            config.places = places;
            config.distance = distance[dist];
            if(distance[dist] === distance.EXPLICIT){ // or dist==="EXPLICIT"
                if(content?.weight?.length > 0) // Controls weight matrix 
                    config.weight_matrix = content.weight;
                else
                    return false;
            }
            if(name) config.name = name;
        }
        return config;
    }

    const fileUploaded = (file, type, param) => {                
        if(file){
            setLoading(true);
            let reader = new FileReader();
            reader.onload = content => {                
                let config = {};
                if(type === "json")
                    config = parseJson(content.target.result);        
                else{
                    const data = csv2Array(content.target.result);
                    config[param] = data;
                }
                props.configure(config);   
                setLoading(false);
            };
            reader.readAsText(file);
        }
    };

    return (
        <Form className={classes.Container}>
            <div className={classes.ProblemDesc}>
                <h5>Problem description</h5>
                <p>The <a href="https://en.wikipedia.org/wiki/Travelling_salesman_problem" target="_blank" rel="noopener noreferrer">Travelling Salesperson Problem (TSP)</a> asks
                the following question: "Given a list of cities and the distances between each pair of cities, what is the shortest 
                possible route that visits each city exactly once and returns to the origin city?" It is an NP-hard problem in 
                combinatorial optimization, important in theoretical computer science and operations research.</p>
            </div>
            <Row>
                <Col md="9" className={classes.ProblemDesc}>
                    <p>A JSON configuration file can be uploaded with the problem parameters: <br/>
                    [Some examples can be found on this <a href="examples/tsp/json">link</a>]</p>
                </Col>
                <Col md="3">
                    <Form.Group>                        
                        <input                             
                            type="file"                             
                            ref={configInputEl} 
                            style={{display:"none"}} 
                            onChange={v => fileUploaded(v.target.files[0], "json", "")}/>
                        <Button onClick={()=>configInputEl.current?.click()}>Upload configuration file...</Button>
                    </Form.Group>
                </Col>
            </Row>
            <Row style={{marginTop: "15px"}}>
                <Col md="9" className={classes.ProblemDesc}>
                    <p>Otherwise, csv formatted file with the problem places coordinates can be uploaded: <br/> 
                    [One line per coordinate, each coordinate separated by comma]</p>
                </Col>
                <Col md="3">
                    <Form.Group>                        
                        <input                             
                            type="file"                             
                            ref={placesInputEl} 
                            style={{display:"none"}} 
                            onChange={v => fileUploaded(v.target.files[0], "csv", "places")}/>
                        <Button onClick={()=>placesInputEl.current?.click()}>Upload places CSV file...</Button>
                    </Form.Group>
                </Col>
            </Row>
            <Row style={{marginTop: "15px"}}>
                <Col md="9" className={classes.ProblemDesc}>
                    <p>The weight matrix is obtained by selecting the appropiate distance function. In case of "EXPLICIT" distance
                        function selected, then a distance matrix should be provided by uploading a CSV file.</p>                    
                </Col>
                <Col md="3">
                    <Form.Group>                        
                        <Form.Control 
                            as="select" 
                            value={props.fitness.distance} // defaultValue does not work in this case because of rendering order
                            onChange={v=>props.configure({distance:v.target.value})}
                        >
                        {
                            Object.keys(distance).map((d, ind) => (
                                <option key={ind} value={distance[d]}>{d}</option>
                            ))
                        }
                        </Form.Control>
                    </Form.Group>
                    {props.fitness.distance === distance.EXPLICIT && <Form.Group>                        
                        <input                             
                            type="file"                             
                            ref={weightsInputEl} 
                            style={{display:"none"}} 
                            onChange={v => fileUploaded(v.target.files[0], "csv", "weight_matrix")}/>
                        <Button onClick={()=>weightsInputEl.current?.click()}>Upload distances CSV file...</Button>
                    </Form.Group>}
                </Col>
            </Row>
            <Row style={{marginTop: "15px"}}>
                <Col  md="12" lg="6">
                        <MapViewer places={props.fitness.norm_places}/>
                </Col>
                <Col md="12" lg="6">
                    <h5>Current configuration</h5>
                    <Collapsible name="coordinates list" places={props.fitness.places} />
                    <Collapsible name="weight matrix" weights={props.fitness.weight_matrix} />
                </Col>
            </Row>
        </Form>
    );
};

export default TSPConfig;