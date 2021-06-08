import React from 'react';
import { Row, Col, Spinner } from 'react-bootstrap';

const Preloader = props => (
    <Row className="justify-content-center">
        <Col md="auto">
            <Spinner animation="grow" variant="dark" />
        </Col>
        <Col md="auto">
            <Spinner animation="grow" variant="dark" />
        </Col>
        <Col md="auto">
            <Spinner animation="grow" variant="dark" />
        </Col>
    </Row>
);

export default Preloader;