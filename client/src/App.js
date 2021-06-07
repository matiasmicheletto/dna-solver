import React, { useState, useEffect } from "react";
import { Container } from "react-bootstrap";
import TopNavbar from "./components/topnavbar";
import Dashboard from "./components/dashboard";
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles.css';
import OMProvider from './ManagerContext';


const App = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
      console.log("Loading complete");
    }, 1000);
  }, []);

  return (
    <Container>
      <TopNavbar />      
      { 
        isLoading ? 
        <p>Loading...</p>
        :
        <OMProvider>
          <Dashboard />
        </OMProvider>
      }
    </Container>
  );
};


export default App;
