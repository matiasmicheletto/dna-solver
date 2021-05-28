import React, { useState, useEffect } from "react";
import { Container } from "react-bootstrap";
import TopNavbar from "./components/topnavbar";
import Dashboard from "./components/dashboard";
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles.css';
import GA, {selection, mutation} from './ga';
import Fitness from './fitness/nqueens';

const config = { // GA parameters  
  pop_size: 15, 
  mut_prob: 0.5,
  mut_fr: 0.8,
  mutation: mutation.RAND,
  ...Fitness
};

const ga = new GA(config);

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
        <Dashboard ga={ga}/>
      }
    </Container>
  );
};


export default App;
