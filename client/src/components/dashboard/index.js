import React, { useContext, useState } from 'react';
import { Row } from 'react-bootstrap';
import { LoadingContext } from '../../context/LoadingContext';
import Preloader from '../preloader';
import Configurator from '../configurator';
import Controller from '../controller';
import Plotter from '../plotter';

const Dashboard = () => {
    const { loading } = useContext(LoadingContext);

    // A dummy state to force a dashboard update
    // For example, when managing the optimizers
    // from the controller, and the status should
    // be reflected on the configurator
    const [update, setUpdate] = useState(false); 
    
    return (
        <Row>
            {loading && <Preloader />}
            <Configurator />
            <Controller onChange={()=>setUpdate(!update)}/>
            <Plotter />
        </Row>
    );
};

export default Dashboard;