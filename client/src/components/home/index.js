import React, { useState, useEffect } from "react";
import {
  Container
} from "react-bootstrap";


function Home() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
      console.log("Loading complete");
    }, 3000);
  }, []);

  return (
    <Container fluid>
      { 
        isLoading ? 
        <p>loading...</p>
        :
        <p>hello</p>        
      }
    </Container>
  );
}

export default Home;
