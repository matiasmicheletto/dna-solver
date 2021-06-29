import React, { useEffect, useRef, useState } from 'react';
import queen from '../../img/chess_queen.png';

const NQueensSolutionViewer = props => {
    const canvasRef = useRef(null);
    const queenRef = useRef(null);

    // To re-render component when queen icon is loaded
    const [loaded, setLoaded] = useState(false); 

    useEffect(() => {       
        const canvas = canvasRef.current;
        canvas.width = 500;
        canvas.height = canvasRef.current.clientWidth; // Make square        
        const ctx = canvas.getContext("2d");
        // Chess square size is the modal width divided by the chess size
        const squareSize = canvasRef.current.clientWidth/props.fitness.N; 
        const queenImg = queenRef.current; // Reference to the queen icon
        for(let i=0; i<props.fitness.N; i++) // Row
          for(let j=0; j<props.fitness.N; j++) { // Column
            ctx.fillStyle = ((i + j) % 2 === 0) ? "white":"gray";
            ctx.fillRect(j*squareSize, i*squareSize, squareSize, squareSize);
            // props.genotype is the array containing the solution where each element
            // is the number of row where the queen is placed
            if(props.genotype[j] === i) 
              ctx.drawImage(queenImg, j*squareSize, i*squareSize, squareSize, squareSize);
          }
        ctx.strokeStyle = "black";
        ctx.strokeRect(0, 0, squareSize*props.fitness.N, squareSize*props.fitness.N)
    });

    return (
        <center>
          <canvas ref={canvasRef}/>
          <img 
            alt="Queen" 
            ref={queenRef} 
            src={queen} 
            hidden={true} 
            onLoad={()=>setLoaded(true)}/>
        </center>
    )
};

export default NQueensSolutionViewer;