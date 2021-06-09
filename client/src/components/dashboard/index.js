import React, { useContext } from 'react';
import { Row } from 'react-bootstrap';
import { LoadingContext } from '../../context/LoadingContext';
import Preloader from '../preloader';
import Configurator from '../configurator';
import Controller from '../controller';

const Dashboard = () => {
    const { loading, setLoading } = useContext(LoadingContext);
    
    setTimeout(() => {
        setLoading(false);
        console.log("Loading complete");
    }, 1000);    
    
    return (
        <Row>
            {loading && <Preloader />}
            <Configurator />
            <Controller />
        </Row>
    );
};

export default Dashboard;