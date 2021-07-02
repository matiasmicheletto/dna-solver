import React, { useEffect, useRef } from "react";

const QuadraticSolutionViewer = props => {
    const canvasRef = useRef(null);

    useEffect(() => {
        let canvas  = canvasRef.current;
        const cw = canvas.width  = canvas.offsetWidth;
        const ch = canvas.height  = canvas.width;
        const ctx = canvas.getContext("2d");
        
        // Fitness function scaled to canvas size
        const scaled_objective = x => {
            const y = props.fitness.objective(x);
            // Scaling
            const xx = (x/props.fitness.z1*.9+.05)*cw;
            const yy = ch - (y/props.fitness.a*.9+.05)*ch;
            return [xx,yy];
        };

        // Draw axis
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(cw*.05, ch*.05);
        ctx.lineTo(cw*.05, ch*.95);
        ctx.lineTo(cw, ch*.95);
        ctx.stroke();
        ctx.strokeText("X", cw-10, ch-5);
        ctx.strokeText("Y", 5, 30);

        // Draw curve
        ctx.lineWidth = 5;
        ctx.strokeStyle = "red";
        ctx.beginPath();
        ctx.moveTo(cw*.05, ch*.95); // Origin
        for(let x = 1; x < props.fitness.z1; x++)
            ctx.lineTo(...scaled_objective(x));
        ctx.stroke();

        // Draw phenotype position 
        ctx.lineWidth = 2;
        ctx.strokeStyle = "blue";
        const x = props.fitness.decode(props.genotype);
        const pos = scaled_objective(x);
        ctx.beginPath();
        ctx.arc(pos[0], pos[1], 5, 0, 2 * Math.PI); 
        ctx.fill();        

        // Draw axis lines
        ctx.beginPath();
        ctx.moveTo(cw*0.05, pos[1]);
        ctx.lineTo(pos[0], pos[1]);
        ctx.lineTo(pos[0], ch*.95);
        ctx.stroke();

        // Draw x and y values
        ctx.lineWidth = 1;
        ctx.strokeStyle = "black";
        ctx.strokeText(props.fitness.objective(x).toFixed(2), 5, pos[1]);
        ctx.strokeText(x.toFixed(2), pos[0], ch-5);
    });

    return (
        <center>
            <canvas ref={canvasRef} style={{width:"70%", maxWidth:"500px"}}/>
        </center>
    )
}

export default QuadraticSolutionViewer;