import React, { Component } from 'react';
import Chart from 'react-apexcharts';



class AreaChart extends Component {
     
	constructor(props) {
	  super(props);

	  this.state = {
		options: {
		  dataLabels: {
			enabled: false
		  },
		  stroke: {
			curve: 'smooth'
		  },
		colors: ['#49a9ea','#36CAAB','#B370CF','#E95E4F','#34495E'],

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
	}

	render() {
	  return (
		

		<div id="chart">
		  <Chart options={this.state.options} series={this.state.series} type="area" height="350" />
		</div>
);
	}
  }

function BarChart() {

	const options = {
		chart: {
			height: 350,
			type: 'line',
			shadow: {
				enabled: true,
				color: '#000',
				top: 18,
				left: 7,
				blur: 10,
				opacity: 1
			},
			toolbar: {
				show: false
			}
		},
		colors: ['#49a9ea','#36CAAB','#B370CF','#FFFFFF','#34495E'],
		dataLabels: {
			enabled: true,
		},
		stroke: {
			curve: 'smooth'
		},
		series: [{
			name: "DQI-Result",
			data: [95.38, 95.17, 95.13, 95.15, 95.14, 33]
		}],
		grid: {
			borderColor: '#e7e7e7',
			row: {
				colors: ['#f3f3f3', 'transparent'],
				opacity: 0.5
			},
		},
		markers: {		
			size: 6
		},
		xaxis: {
			categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
			title: {
				text: 'DQI Score'
			}
		},
		yaxis: {
			title: {
				text: 'Data Quality Index'
			}
		}
	}

	return (
		<div className="bar">
			<Chart options={options} series={options.series} height="200px"/>
		</div>
	);
}

export default AreaChart;
