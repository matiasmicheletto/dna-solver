import React from 'react';
import { 
    Row, 
    Col, 
    Form, 
    InputGroup,
    Button 
} from 'react-bootstrap';
import { 
    crossover, 
    mutation, 
    selection,
    controlled_param,
    controller_var 
} from 'optimization/ga/index.mjs';
import classes from './styles.module.css';

const namespace = { // Parameter names
    ROULETTE: "Roulette wheel",
    RANK: "Ranking",
    TOURNAMENT: "Tournament",
    SINGLE: "Single point",
    DOUBLE: "Double point",
    CYCLE: "Cycle",
    PMX: "Partially-Mapped",
    BITFLIP: "Bit flip",
    RAND: "Random gen",
    SWAP: "Genes swap",
    CROSS_PROB: "Crossover prob.",
    MUT_PROB: "Mutation prob.",
    RANK_R: "Ranking dist. (R)",
    TOURN_K: "Tournament size (K)",
    GENERATION: "Generation",
    EVOL_SLOPE: "Evolution slope",
    POP_S2: "Population variance",
    POP_AVG: "Population avg. fitness"
};

// Enabled/Disabled class toggler
const getLabelClass = disabled => disabled? classes.DisabledLabel : classes.Label;
const getInputClass = disabled => disabled? classes.DisabledInput : classes.Input;

const GAConfigForm = props => (
    <Form>
        <Row className={classes.FormRow}>
            <Col md="12" lg="6">
                <InputGroup>
                    <InputGroup.Text className={getLabelClass(props.disabled)}>Population size</InputGroup.Text>
                    <Form.Control className={getInputClass(props.disabled)}
                        type="number"
                        disabled={props.disabled}
                        placeholder="Population size"
                        min="4"
                        max="500"
                        defaultValue={props.current.pop_size}
                        onChange={v => props.onChange("pop_size", parseInt(v.target.value))}
                    >
                    </Form.Control>
                </InputGroup>
            </Col>
            <Col>
                <InputGroup>
                    <InputGroup.Text className={getLabelClass(props.disabled)}>Elite individuals</InputGroup.Text>
                    <Form.Control className={getInputClass(props.disabled)}
                        type="number"
                        disabled={props.disabled}
                        placeholder="Elitism"
                        min="0"
                        max={Math.round(props.current.pop_size*0.8)}
                        defaultValue={props.current.elitism}
                        onChange={v => props.onChange("elitism", parseInt(v.target.value))}
                    >
                    </Form.Control>
                </InputGroup>
            </Col>
        </Row>
        <Row className={classes.FormRow}>
            <Col md="12" lg={props.current.selection === selection.ROULETTE ? "12" : "6"}>
                <InputGroup>
                    <InputGroup.Text className={getLabelClass(props.disabled)}>Selection</InputGroup.Text>
                    <Form.Control className={getInputClass(props.disabled)} 
                        as="select" 
                        disabled={props.disabled}
                        value={props.current.selection}
                        onChange={v => props.onChange("selection", v.target.value)}
                    >
                    {
                        Object.keys(selection).map((s,ind) => (
                            <option key={s} value={selection[s]}>{namespace[s]}</option>
                        ))
                    }
                    </Form.Control>
                </InputGroup>
            </Col>
            {
                props.current.selection === selection.RANK &&
                <Col md="12" lg="6">
                    <InputGroup>
                        <InputGroup.Text className={getLabelClass(props.disabled)}>Ranking R</InputGroup.Text>
                        <Form.Control className={getInputClass(props.disabled)}
                            type="number"
                            disabled={props.disabled}
                            placeholder="Rank. R"
                            min="0"
                            max={2/props.current.pop_size/(props.current.pop_size-1)}
                            step="0.001"
                            defaultValue={props.current.rank_r}
                            onChange={v => props.onChange("rank_r", parseFloat(v.target.value))}
                        >
                        </Form.Control>
                    </InputGroup>
                </Col>
            }
            {
                props.current.selection === selection.TOURNAMENT && 
                <Col md="12" lg="6">
                    <InputGroup>
                        <InputGroup.Text className={getLabelClass(props.disabled)}>Tournament K</InputGroup.Text>
                        <Form.Control className={getInputClass(props.disabled)}
                            type="number"
                            disabled={props.disabled}
                            placeholder="Torunament K"
                            min="0"
                            max="10"
                            defaultValue={props.current.tourn_k}
                            onChange={v => props.onChange("tourn_k", parseInt(v.target.value))}
                        >
                        </Form.Control>
                    </InputGroup>
                </Col>
            }
        </Row>
        <Row className={classes.FormRow}>
            <Col md="12" lg="6">
                <InputGroup>
                    <InputGroup.Text className={getLabelClass(props.disabled)}>Crossover operator</InputGroup.Text>
                    <Form.Control className={getInputClass(props.disabled)} 
                        as="select" 
                        disabled={props.disabled}
                        value={props.current.crossover}
                        onChange={v => props.onChange("crossover", v.target.value)}
                    >
                    {
                        Object.keys(crossover).map((c,ind) => (
                            <option key={c} value={crossover[c]}>{namespace[c]}</option>
                        ))
                    }
                    </Form.Control>
                </InputGroup>
            </Col>
            <Col md="12" lg="6">
                <InputGroup>
                    <InputGroup.Text className={getLabelClass(props.disabled)}>Crossover prob.</InputGroup.Text>
                    <Form.Control className={getInputClass(props.disabled)}
                        type="number"
                        disabled={props.disabled}
                        placeholder="Crossover prob."
                        min="0"
                        max="1"
                        step="0.01"
                        defaultValue={props.current.cross_prob}
                        onChange={v => props.onChange("cross_prob", parseFloat(v.target.value))}
                    >
                    </Form.Control>
                </InputGroup>
            </Col>
        </Row>
        <Row className={classes.FormRow}>
            <Col md="12" lg="6">
                <InputGroup>
                    <InputGroup.Text className={getLabelClass(props.disabled)}>Mutation operator</InputGroup.Text>
                    <Form.Control className={getInputClass(props.disabled)} 
                        as="select" 
                        disabled={props.disabled}
                        value={props.current.mutation}
                        onChange={v => props.onChange("mutation", v.target.value)}
                    >
                    {
                        Object.keys(mutation).map(m => (
                            <option key={m} value={mutation[m]}>{namespace[m]}</option>
                        ))
                    }
                    </Form.Control>
                </InputGroup>
            </Col>
            <Col md="12" lg="6">
                <InputGroup>
                    <InputGroup.Text className={getLabelClass(props.disabled)}>Mutation prob.</InputGroup.Text>
                    <Form.Control className={getInputClass(props.disabled)}
                        type="number"
                        disabled={props.disabled}
                        placeholder="Mutation prob."
                        min="0"
                        max="1"
                        step="0.01"
                        defaultValue={props.current.mut_prob}
                        onChange={v => props.onChange("mut_prob", parseFloat(v.target.value))}
                    >
                    </Form.Control>
                </InputGroup>
            </Col>
        </Row>
        <Row className={classes.FormRow}>
            <Col md="12" lg="2">
                <Button
                    style={{width:"100%"}}                    
                    disabled={props.disabled}
                    className={getLabelClass(props.disabled)} 
                    onClick={() => props.onChange("param_control_enabled", !props.current.param_control_enabled)}>
                    {props.current.param_control_enabled ? "Dynamic param.":"Constant param."}
                </Button>
            </Col>
            <Col md="12" lg="4">
                <InputGroup as={Col}>
                    <InputGroup.Text className={getLabelClass(props.disabled || !props.current.param_control_enabled)}>Controlled</InputGroup.Text>
                    <Form.Control 
                        className={getInputClass(props.disabled || !props.current.param_control_enabled)} 
                        disabled={props.disabled || !props.current.param_control_enabled}
                        as="select"
                        value={props.current.controlled_param} 
                        onChange={v => props.onChange("controlled_param", v.target.value)}
                    >
                    {
                        Object.keys(controlled_param).map(m => (
                            <option key={m} value={controlled_param[m]}>{namespace[m]}</option>
                        ))
                    }
                    </Form.Control>                
                </InputGroup>
            </Col>
            <Col md="12" lg="3">
                <InputGroup as={Col}>
                    <InputGroup.Text className={getLabelClass(props.disabled || !props.current.param_control_enabled)}>Incr. factor</InputGroup.Text>
                    <Form.Control 
                        className={getInputClass(props.disabled || !props.current.param_control_enabled)}
                        disabled={props.disabled || !props.current.param_control_enabled}
                        type="number"
                        placeholder="Increment factor"
                        defaultValue={props.current.param_control_factor}
                        onChange={v => props.onChange("param_control_factor", parseFloat(v.target.value))}
                    >
                    </Form.Control>
                </InputGroup>
            </Col>
            <Col md="12" lg="3">
                <InputGroup as={Col}>
                    <InputGroup.Text className={getLabelClass(props.disabled || !props.current.param_control_enabled)}>Controller</InputGroup.Text>
                    <Form.Control 
                        className={getInputClass(props.disabled || !props.current.param_control_enabled)} 
                        disabled={props.disabled || !props.current.param_control_enabled}
                        as="select"
                        value={props.current.controller_var}
                        onChange={v => props.onChange("controller_var", v.target.value)}
                    >
                    {
                        Object.keys(controller_var).map(m => (
                            <option key={m} value={controller_var[m]}>{namespace[m]}</option>
                        ))
                    }
                    </Form.Control>
                </InputGroup>
            </Col>
        </Row>
    </Form>
)

export default GAConfigForm;