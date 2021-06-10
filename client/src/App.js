import React, { useState } from "react";
import { Container } from "react-bootstrap";
import TopNavbar from "./components/topnavbar";
import Dashboard from "./components/dashboard";
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles.css';
import OMProvider from './context/ManagerContext';
import { LoadingContext } from './context/LoadingContext';

const App = () => {

  const [loading, setLoading] = useState(false);

  return (
    <Container>
      <TopNavbar/>
        <OMProvider>
          <LoadingContext.Provider value={{loading, setLoading}}>
            <Dashboard />
          </LoadingContext.Provider>
        </OMProvider>
    </Container>
  );
};

export default App;