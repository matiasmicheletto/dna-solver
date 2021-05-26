import React, { useState, useEffect } from "react";
import { Container } from "react-bootstrap";
import TopNavbar from "./components/topnavbar";
import Dashboard from "./components/dashboard";
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles.css';
import GA, {selection} from './ga';


const config = { // GA parameters
  //fitness: (x) => {const y = 10000-(x-181)*(x-181); return y < 0 ? 0 : y}, // Global maxima at 0000000010110101
  fitness: (x) => 10000-(x-181)*(x-181), // Global maxima at 0000000010110101
  pop_size: 15,
  selection: selection.RANK
};

const ga = new GA(config);

const App = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
      console.log("Loading complete");
    }, 3000);
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
