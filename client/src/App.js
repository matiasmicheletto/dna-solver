import React, { useState } from "react";
import { Container } from "react-bootstrap";
import TopNavbar from "./components/topnavbar";
import Dashboard from "./components/dashboard";
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles.css';
import ExperimentProvider from './context/ExperimentCtx';
import { LoadingContext } from './context/LoadingContext';

const App = () => {

  const [loading, setLoading] = useState(false);

  return (
    <Container>
      <TopNavbar/>
        <ExperimentProvider>
          <LoadingContext.Provider value={{loading, setLoading}}>
            <Dashboard />
          </LoadingContext.Provider>
        </ExperimentProvider>
    </Container>
  );
};

export default App;