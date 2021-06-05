import React, { useState, useEffect } from "react";
import { Container } from "react-bootstrap";
import TopNavbar from "./components/topnavbar";
import Dashboard from "./components/dashboard";
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles.css';
import OptManager from './manager';

const om = new OptManager();

const App = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
      console.log("Loading complete");
    }, 2000);
  }, []);

  return (
    <Container>
      <TopNavbar />      
      { 
        isLoading ? 
        <p>loading...</p>
        :
        <Dashboard manager={om}/>
      }
    </Container>
  );
};


export default App;
