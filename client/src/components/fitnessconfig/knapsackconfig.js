import React, { 
    useContext, 
    useRef, 
    useState, 
    useEffect 
} from 'react';
import { 
    Row, 
    Col, 
    Form, 
    Table, 
    Collapse,
    Button,
    InputGroup 
} from 'react-bootstrap';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import classes from './styles.module.css';
import { LoadingContext } from '../../context/LoadingContext';
import { penalty, filters } from 'optimization/fitness/knapsack.mjs';
import { csv2Array } from 'optimization/tools/index.mjs';

/*
    KnapsackConfig Component
    -----------------------
    This component renders the problem description and the 
    form required to configure all of the knapsack fitness 
    model parameters, which is the set of value-weight pairs 
    for each item and should be imported from a correctly 
    formatted csv file.
*/

const ItemsTable = props => ( // Table for listing the knapsack items
    <Table striped bordered hover responsive>
        <thead>
            <tr>
                <th>Item</th>
                <th>Value</th>
                <th>Weight</th>
            </tr>
        </thead>
        <tbody>
            {
                props.items.map( (p,ind) => 
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

const Collapsible = props => { // Collapsible to hide or show the items list
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
                                Hide item list
                                <FaChevronUp />
                            </div>    
                            :
                            <div>
                                Show item list
                                <FaChevronDown />
                            </div>
                        }
                    </Button>
                </Col>
            </Row>
            <Collapse in={open}>
                <Row>
                    {props.items && <ItemsTable {...props} />}
                </Row>
            </Collapse>
        </div>
    );
};

const FilterViewer = props => { // Small space to draw the penalty filter
    const canvasRef = useRef(null);        

    useEffect(() => {                
        const canvas = canvasRef.current;
        // Fixed dimensions
        const cw = canvas.width = 500;
        const ch = canvas.height = 250;
        const ctx = canvas.getContext("2d");        

        const scaled_objective = x => {
            const y = props.fc(x);
            // Scaling
            const xx = (x / props.maxx * .9 + .05)*cw;
            const yy = ch - (y*.9 + .05) * ch;
            return [xx,yy];
        };

        ctx.font = "normal 15px Arial";
        ctx.strokeText("W", cw - 20, ch*.99);
        ctx.strokeText("L="+props.wl, scaled_objective(props.wl)[0], ch*.99);
        ctx.strokeText("P", cw*.02, ch*.1);

        // Draw axis
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(cw*.05, ch*.05);
        ctx.lineTo(cw*.05, ch*.95);
        ctx.lineTo(cw, ch*.95);
        ctx.stroke();        

        // Draw filter curve
        ctx.lineWidth = 3;
        ctx.strokeStyle = "red";
        ctx.beginPath();
        ctx.moveTo(cw*.05, ch*.05); // (0,1)
        const step = Math.floor(props.maxx/100);
        for(let x = 0; x < props.maxx; x+=step)
            ctx.lineTo(...scaled_objective(x));
        ctx.stroke();        
    });

    return(
        <center>
            <canvas ref={canvasRef} style={{width:"100%"}}></canvas>
        </center>
    );
};

const KnapsackConfig = props => {    
    // Preloader is used when loading .csv data
    const {loading, setLoading} = useContext(LoadingContext);

    // To customize the file input, we use refs to trigger the click event from other buttons
    const fileInputEl = useRef(null);


    const fileUploaded = (file) => {                
        if(file){
            setLoading(true);
            let reader = new FileReader();
            reader.onload = content => {                                
                const data = csv2Array(content.target.result);
                props.configure({items: data});   
                setLoading(false);
            };
            reader.readAsText(file);
        }
    };

    return (
        <Form className={classes.Container}>
            <div className={classes.ProblemDesc}>
                <h5>Problem description</h5>
                <p>The <a href="https://en.wikipedia.org/wiki/Knapsack_problem" target="_blank" rel="noopener noreferrer">
                Knapsack problem</a> consists on a set of items, each with a value and a weight, where a selected 
                subset of items should be determined so that the total weight is less than or equal to a 
                given limit and the total value is as large as possible. It derives its name from the problem faced 
                by someone who is constrained by a fixed-size knapsack and must fill it with the most valuable items.</p>
                <p>Three different penalty functions are provided for this model depending on the desired treatment for 
                unfeasible solutions. STEP penalty function is recommended for lowest constrained problems, as it 
                filters the unfeasible solutions returning a 0 value. RAMP or SIGMOID functions show better performance when
                solving highly constrained problems, as it divides the fitness values that falls near
                the weight limit by small constants. The penalty level allows to control the sensivity of the filter, the higher
                is the selected value, the higher will be the sensivity of the filter around the weight limit value.</p>
                <Row>
                    <Col md="12" lg="6">
                        <Row style={{marginBottom:"20px"}}>
                            <InputGroup>
                                <InputGroup.Text>Weight limit</InputGroup.Text>
                                <Form.Control
                                    type="number"
                                    min="1"
                                    placeholder="Weight limit"
                                    defaultValue={props.fitness.W}
                                    onChange={v => props.configure({W: parseInt(v.target.value)})}
                                >
                                </Form.Control>
                            </InputGroup>
                        </Row>
                        <Row style={{marginBottom:"20px"}}>
                            <InputGroup>
                                <Form.Label style={{marginRight:"20px"}}>Penalty function</Form.Label>
                                <Form>
                                    <Form.Check 
                                        name="penalty_radio" 
                                        label="Step" 
                                        type="radio" 
                                        checked={props.fitness.penalty===penalty.STEP} 
                                        onChange={v=>{if(v.target.checked) props.configure({penalty:penalty.STEP})}} />
                                    <Form.Check 
                                        name="penalty_radio" 
                                        label="Ramp" 
                                        type="radio" 
                                        checked={false}
                                        checked={props.fitness.penalty===penalty.RAMP}  
                                        onChange={v=>{if(v.target.checked) props.configure({penalty:penalty.RAMP})}} />
                                    <Form.Check 
                                        name="penalty_radio" 
                                        label="Sigmoid" 
                                        type="radio" 
                                        checked={false}
                                        checked={props.fitness.penalty===penalty.SIGMOID}  
                                        onChange={v=>{if(v.target.checked) props.configure({penalty:penalty.SIGMOID})}} />
                                </Form>
                            </InputGroup>
                        </Row>
                        {
                            (props.fitness.penalty!==penalty.STEP && <Row>
                                <InputGroup>
                                    <InputGroup.Text>Penalty Level</InputGroup.Text>
                                    <Form.Control
                                        type="number"
                                        min="0.01"
                                        step="0.01"
                                        placeholder="Penalty"
                                        defaultValue={props.fitness.penalty_lvl}
                                        onChange={v => props.configure({penalty_lvl: parseFloat(v.target.value)})}
                                    >
                                    </Form.Control>
                                </InputGroup>
                            </Row>)
                        }
                    </Col>
                    <Col md="12" lg="6">
                        <FilterViewer fc={props.fitness.penalty_fc} wl={props.fitness.W} maxx={props.fitness.max_weight}/>
                    </Col>
                </Row>                             
                <Row style={{marginBottom:"5px", marginTop:"10px"}} >
                    <Collapsible items={props.fitness.items} />
                </Row>
                <p>In order to use a different set of items, a <b>.csv</b> file can be provided. First column of the file corresponds to
                the values and second column to the weights of each item (an example can be found in this <a href="examples/knapsack">link</a>).</p>
                <Form.Group>                        
                    <input                             
                        type="file"                             
                        ref={fileInputEl} 
                        style={{display:"none"}} 
                        onChange={v => fileUploaded(v.target.files[0])}/>
                    <Button onClick={()=>fileInputEl.current?.click()}>Upload items set file...</Button>
                </Form.Group>                
            </div>
        </Form>
    );
};

export default KnapsackConfig;