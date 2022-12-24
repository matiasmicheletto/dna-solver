import React, { useState } from "react";
import { Container } from "react-bootstrap";
import TopNavbar from "./components/topnavbar";
import Dashboard from "./components/dashboard";
import ExperimentProvider from './context/ExperimentCtx';
import { LoadingContext } from './context/LoadingContext';

const App = () => {

  const [loading, setLoading] = useState(false);

  return (
    <Container style={{marginTop: "100px"}}>
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