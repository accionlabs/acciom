import React, { Component } from 'react';
import Chart from 'react-apexcharts';
import { connect } from 'react-redux';



class AreaChart extends Component {
     
	constructor(props) {
	  super(props);
		
	}

	render() {
		let options = {
			dataLabels: {
			enabled: false
			},
			stroke: {
			curve: 'smooth'
			},
			colors: ['#49a9ea','#36CAAB','#B370CF','#E95E4F','#34495E'],
			xaxis: {
			type: 'date',
			categories: []
			},
			tooltip: {
			x: {
				format: 'dd/MM/yy'
			},
			},
		}

		let series =  [{name:"countcheck",data:[]},
					   {name:"datavalidation",data:[]},
					   {name:"nullcheck",data:[]},
					   {name:"duplicatecheck",data:[]},
					   {name:"ddlcheck",data:[]},
					   {name:"average_dqi",data:[]}
					];

		options.xaxis.categories = [];
		if (this.props.projectDataHistory !== undefined) {
			options.xaxis.categories = Object.keys(this.props.projectDataHistory);
			console.log("options.xaxis.categories ========>",options.xaxis.categories );
			for(let prop in this.props.projectDataHistory){
				var date_object=this.props.projectDataHistory[prop];
				series[0].data.push(date_object.hasOwnProperty('countcheck') ? date_object.countcheck : 0);
				series[1].data.push(date_object.hasOwnProperty('datavalidation') ? date_object.datavalidation : 0);
				series[2].data.push(date_object.hasOwnProperty('nullcheck') ? date_object.nullcheck : 0);
				series[3].data.push(date_object.hasOwnProperty('duplicatecheck') ? date_object.duplicatecheck : 0);
				series[4].data.push(date_object.hasOwnProperty('ddlcheck') ? date_object.ddlcheck : 0);
				series[5].data.push(date_object.hasOwnProperty('average_dqi') ? date_object.average_dqi : 0);
				console.log("series=========>",series);
				console.log("date_object=========>",date_object.countcheck);
				console.log("prop=======", prop)
			}
			console.log(series);
		}
		return (
		<div id="chart">
			{/* <Chart options={options()} series={this.state.series} type="area" height="350" /> */}
		  <Chart options={options} series={series} type="area" height="350" />
		</div>
		);
	}
  }


const mapStateToProps = state => {
	return {
		projectDataQuality: state.dashboardData.projectDataQuality,
		currentProject: state.appData.currentProject,
		projectDataHistory: state.dashboardData.projectDataHistory
	};
};

const mapDispatchToProps = dispatch => ({
	getDQIprojectDetails: (data) => dispatch(getDQIprojectDetails(data)),
	getHistoryGraphdata: (data) => dispatch(getHistoryGraphdata(data)),
})

export default connect(mapStateToProps, mapDispatchToProps)(AreaChart);
