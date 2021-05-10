import React, { useState, useEffect } from "react";
import {
  Container
} from "react-bootstrap";
import TopNavbar from "./components/topnavbar"
import { container } from "./style"
import 'bootstrap/dist/css/bootstrap.min.css';

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
        <p>hello</p>        
      }
    </Container>
  );
};


export default App;
