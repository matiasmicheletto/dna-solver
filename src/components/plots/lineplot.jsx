import React, { useEffect } from 'react';
import Highcharts from 'highcharts';

const LinePlot = props => {

    const config = {
        chart:{
            height: "100%",
            zoomType: "xy"
        },
        title: {
            text: props.config.title
        },        
        credits:{
            enabled:false
        },
        yAxis: {
            title: {
                text: props.config.yaxis
            }
        },
        xAxis: {
            title: {
                text: props.config.xaxis
            }
        },
        series: props.config.series
    };

    useEffect(()=>{
        Highcharts.chart(props.id, config);
    });

    return (
        <figure className="highcharts-figure">
            <div id={props.id}></div>                
        </figure>
    );
}

export default LinePlot;