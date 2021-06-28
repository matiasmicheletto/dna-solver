import React, { useEffect, useRef } from 'react';

const TspSolutionViewer = props => {
    const canvasRef = useRef(null);

    useEffect(() => {        
        let canvas = canvasRef.current;
        canvas.width = 500;
        canvas.height = canvasRef.current.clientWidth; // Make square        
        let ctx = canvas.getContext("2d");
        const places = props.fitness.norm_places;
        // Draw positions
        for(let p = 0; p < places.length; p++){            
            ctx.beginPath();
            const d = props.data[p];
            const posx = places[d][0]*canvas.width;
            const posy = places[d][1]*canvas.height;
            ctx.arc(posx, posy, 5, 0, 2 * Math.PI);
            ctx.fill();
        }
        // Draw paths
        ctx.beginPath();
        for(let p = 0; p < places.length; p++){
            const d = props.data[p];
            ctx.lineTo(places[d][0]*canvas.width, places[d][1]*canvas.height);
        }
            
        // Return to origin
        ctx.lineTo(places[props.data[0]][0]*canvas.width, places[props.data[0]][1]*canvas.height);
        ctx.stroke();
    });

    return (
        <center>
            <canvas ref={canvasRef} />
        </center>
    )
};

export default TspSolutionViewer;