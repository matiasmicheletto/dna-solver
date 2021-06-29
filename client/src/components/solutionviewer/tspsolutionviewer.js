import React, { useEffect, useRef } from 'react';

const TspSolutionViewer = props => {
    const canvasRef = useRef(null);

    useEffect(() => {        
        let canvas = canvasRef.current;
        // Make square
        canvas.width = canvas.height = 500;
        const cw = canvasRef.current.clientWidth;
        const ch = canvasRef.current.clientWidth; 
        const ctx = canvas.getContext("2d");
        const places = props.fitness.norm_places;
        
        // Draw positions as filled circles
        for(let p = 0; p < places.length; p++){            
            const posx = (places[p][0]*.9 + .05)*cw;
            const posy = (places[p][1]*.9 + .05)*ch;
            ctx.beginPath();
            ctx.arc(posx, posy, 5, 0, 2 * Math.PI); 
            ctx.fill();
            ctx.strokeText(p,posx+6,posy+6);
        }
        // Draw paths in order
        ctx.strokeStyle = "red";
        ctx.beginPath();
        for(let p = 0; p < places.length; p++){
            const d = props.genotype[p]; // Order is given by data array
            const posx = (places[d][0]*.9 + .05)*cw;
            const posy = (places[d][1]*.9 + .05)*ch;
            ctx.lineTo(posx, posy);
        }
        // Return to origin
        const xo = (places[0][0]*.9 + .05)*cw;
        const yo = (places[0][1]*.9 + .05)*ch;
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