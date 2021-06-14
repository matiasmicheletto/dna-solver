import React, { useEffect, useState } from 'react';
import Highcharts from 'highcharts';

const LinePlot = props => {

    const config = {
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
        legend: {
            layout: 'vertical',
            align: 'right',
            verticalAlign: 'middle'
        },
        series: props.config.series,
        responsive: {
            rules: [{
                condition: {
                    maxWidth: 500
                },
                chartOptions: {
                    legend: {
                        layout: 'horizontal',
                        align: 'center',
                        verticalAlign: 'bottom'
                    }
                }
            }]
        }
    };

    useEffect(()=>{
        Highcharts.chart(props.id, config);
    })

    return (
        <figure className="highcharts-figure">
            <div id={props.id}></div>                
        </figure>
    );
}

export default LinePlot;