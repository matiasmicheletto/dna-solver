import React, { useState, useEffect } from "react";
import {
  Container
} from "react-bootstrap";
import TopNavbar from "./components/topnavbar"
import Dashboard from "./components/dashboard"
import { container } from "./style"
import 'bootstrap/dist/css/bootstrap.min.css';
import GA from './ga';

const ga = new GA();

const App = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
      console.log("Loading complete");
    }, 3000);
  }, []);

  return (
    <Container style={container}>
      <TopNavbar />      
      { 
        isLoading ? 
        <p>loading...</p>
        :
        <Dashboard ga={ga}/>
      }
    </Container>
  );
};


export default App;
