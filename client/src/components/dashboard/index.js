import React, { useContext } from 'react';
import { Row } from 'react-bootstrap';
import Configurator from '../configurator';
import { LoadingContext } from '../../context/LoadingContext';
import Preloader from '../preloader';

const Dashboard = () => {
    const { loading, setLoading } = useContext(LoadingContext);
    
    setTimeout(() => {
        setLoading(false);
        console.log("Loading complete");
    }, 2000);    
    
    return (
        <Row>
            {loading && <Preloader />}
            <Configurator />             
        </Row>
    );
};

export default Dashboard;