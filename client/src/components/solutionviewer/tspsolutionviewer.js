import React, { useEffect, useRef } from 'react';

const TspSolutionViewer = props => {
    const canvasRef = useRef(null);

    useEffect(() => {        
        let canvas = canvasRef.current;
        canvas.width = 500;
        canvas.height = canvasRef.current.clientWidth; // Make square        
        let ctx = canvas.getContext("2d");
        const places = props.fitness.norm_places;
        
        // Draw positions as filled circles
        for(let p = 0; p < places.length; p++){            
            ctx.beginPath();            
            const posx = (places[p][0]*0.9 + 0.05)*canvas.width;
            const posy = (places[p][1]*0.9 + 0.05)*canvas.height;
            ctx.arc(posx, posy, 5, 0, 2 * Math.PI); 
            ctx.fill();
            ctx.strokeText(p,posx+6,posy+6);
        }
        // Draw paths in order
        ctx.strokeStyle = "red";
        ctx.beginPath();
        for(let p = 0; p < places.length; p++){
            const d = props.data[p]; // Order is given by data array
            const posx = (places[d][0]*0.9 + 0.05)*canvas.width;
            const posy = (places[d][1]*0.9 + 0.05)*canvas.height;
            ctx.lineTo(posx, posy);
        }
        // Return to origin
        const xo = (places[0][0]*0.9 + 0.05)*canvas.width;
        const yo = (places[0][1]*0.9 + 0.05)*canvas.height;
        ctx.lineTo(xo, yo);
        ctx.stroke();
    });

    return (
        <center>
            <canvas ref={canvasRef} />
        </center>
    )
};

export default TspSolutionViewer;