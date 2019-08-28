import React, { Component } from 'react';
import Chart from 'react-apexcharts';

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
		colors: ['#77B6EA', '#545454'],
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
			<Chart options={options} series={options.series}  width="1000" height="200px"/>
		</div>
	);
}

export default BarChart;
