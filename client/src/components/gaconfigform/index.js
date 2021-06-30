import React from 'react';
import { Row, Col, Form, InputGroup } from 'react-bootstrap';
import { crossover, mutation, selection } from 'optimization/ga/index.mjs';
import classes from './styles.module.css';

const GAConfigForm = props => (
    <Form>
        <Row className={classes.FormRow}>
            <InputGroup as={Col} sm>
                <InputGroup.Text className={classes.InputLabel}>Population size</InputGroup.Text>
                <Form.Control className={classes.Input}
                    type="number"
                    placeholder="Population size"
                    min="4"
                    max="500"
                    defaultValue={props.current.pop_size}
                    onChange={v => props.onChange("pop_size", parseInt(v.target.value))}
                >
                </Form.Control>
            </InputGroup>
            <InputGroup as={Col} sm>
                <InputGroup.Text className={classes.InputLabel}>Elite individuals</InputGroup.Text>
                <Form.Control className={classes.Input}
                    type="number"
                    placeholder="Elitism"
                    min="0"
                    max={Math.round(props.current.pop_size*0.8)}
                    defaultValue={props.current.elitism}
                    onChange={v => props.onChange("elitism", parseInt(v.target.value))}
                >
                </Form.Control>
            </InputGroup>
        </Row>
        <Row className={classes.FormRow}>
            <InputGroup as={Col} sm>
                <InputGroup.Text className={classes.InputLabel}>Selection operator</InputGroup.Text>
                <Form.Control className={classes.Input} 
                    as="select" 
                    defaultValue={props.current.selection}
                    onChange={v => props.onChange("selection", v.target.value)}
                >
                {
                    Object.keys(selection).map((s,ind) => (
                        <option key={s} value={selection[s]}>{s}</option>
                    ))
                }
                </Form.Control>
            </InputGroup>
            {
                props.current.selection === selection.RANK &&
                <InputGroup as={Col} sm>
                    <InputGroup.Text className={classes.InputLabel}>Ranking selection R</InputGroup.Text>
                    <Form.Control className={classes.Input}
                        type="number"
                        placeholder="Rank. R"
                        min="0"
                        max={2/props.current.pop_size/(props.current.pop_size-1)}
                        step="0.001"
                        defaultValue={props.current.rank_r}
                        onChange={v => props.onChange("rank_r", parseFloat(v.target.value))}
                    >
                    </Form.Control>
                </InputGroup>
            }
            {
                props.current.selection === selection.TOURNAMENT && 
                <InputGroup as={Col} sm>
                    <InputGroup.Text className={classes.InputLabel}>Tournament selection K</InputGroup.Text>
                    <Form.Control className={classes.Input}
                        type="number"
                        placeholder="Torunament K"
                        min="0"
                        max="10"                        
                        defaultValue={props.current.tourn_k}
                        onChange={v => props.onChange("tourn_k", parseInt(v.target.value))}
                    >
                    </Form.Control>
                </InputGroup>
            }
        </Row>
        <Row className={classes.FormRow}>
            <InputGroup as={Col} sm>
                <InputGroup.Text className={classes.InputLabel}>Crossover operator</InputGroup.Text>
                <Form.Control className={classes.Input} 
                    as="select" 
                    defaultValue={props.current.crossover}
                    onChange={v => props.onChange("crossover", v.target.value)}
                >
                {
                    Object.keys(crossover).map((c,ind) => (
                        <option key={c} value={crossover[c]}>{c}</option>
                    ))
                }
                </Form.Control>
            </InputGroup>
            <InputGroup as={Col} sm>
                <InputGroup.Text className={classes.InputLabel}>Crossover probability</InputGroup.Text>
                <Form.Control className={classes.Input}
                    type="number"
                    placeholder="Crossover prob."
                    min="0"
                    max="1"
                    step="0.01"
                    defaultValue={props.current.cross_prob}
                    onChange={v => props.onChange("cross_prob", parseFloat(v.target.value))}
                >
                </Form.Control>
            </InputGroup>
        </Row>
        <Row className={classes.FormRow}>
            <InputGroup as={Col} sm>
                <InputGroup.Text className={classes.InputLabel}>Mutation operator</InputGroup.Text>
                <Form.Control className={classes.Input} 
                    as="select" 
                    defaultValue={props.current.mutation}
                    onChange={v => props.onChange("mutation", v.target.value)}
                >
                {
                    Object.keys(mutation).map((m,ind) => (
                        <option key={m} value={mutation[m]}>{m}</option>
                    ))
                }
                </Form.Control>
            </InputGroup>
            <InputGroup as={Col} sm>
                <InputGroup.Text className={classes.InputLabel}>Mutation probability</InputGroup.Text>
                <Form.Control className={classes.Input}
                    type="number"
                    placeholder="Mutation prob."
                    min="0"
                    max="1"
                    step="0.01"
                    defaultValue={props.current.mut_prob}
                    onChange={v => props.onChange("mut_prob", parseFloat(v.target.value))}
                >
                </Form.Control>
            </InputGroup>
            <InputGroup as={Col} sm>
                <InputGroup.Text className={classes.InputLabel}>Mutation proportion</InputGroup.Text>
                <Form.Control className={classes.Input}
                    type="number"
                    placeholder="Mutation prop."
                    min="0"
                    max="1"
                    step="0.01"
                    defaultValue={props.current.mut_fr}
                    onChange={v => props.onChange("mut_fr", parseFloat(v.target.value))}
                >
                </Form.Control>
            </InputGroup>
        </Row>
    </Form>
)

export default GAConfigForm;