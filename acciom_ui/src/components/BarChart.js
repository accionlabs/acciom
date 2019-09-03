import React, { Component } from 'react';
import Chart from 'react-apexcharts';

function BarChart() {

	const state = {
		options: {
            dataLabels: {
              enabled: false
            },
            stroke: {
              curve: 'smooth'
            },


            xaxis: {
              type: 'datetime',
              categories: ["2018-09-19T00:00:00", "2018-09-19T01:30:00", "2018-09-19T02:30:00",
                "2018-09-19T03:30:00", "2018-09-19T04:30:00", "2018-09-19T05:30:00",
                "2018-09-19T06:30:00"
              ],
            },
            tooltip: {
              x: {
                format: 'dd/MM/yy HH:mm'
              },
            }
          },
          series: [{
            name: 'series1',
            data: [31, 40, 28, 51, 42, 109, 100]
          }, {
            name: 'series2',
            data: [11, 32, 45, 32, 34, 52, 41]
          }],
	}

	return (
		<div className="bar">
			<Chart options={state.options} series={state.series}  width="1000" height="200px" type="area" />
		</div>
	);
}

export default BarChart;
