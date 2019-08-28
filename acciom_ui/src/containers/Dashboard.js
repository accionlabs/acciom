import React from 'react';
import { connect  } from 'react-redux';
import { getOrgDataQuality, getDQIprojectDetails } from '../actions/dashboardActions';
import ProjectChartList from '../containers/ProjectListChartContainer';
import DQIDetailsContainer from '../containers/DQIdetailsContainer';

class Dashboard extends React.Component {
	
	constructor(props) {
		super(props);
		this.state = {};
	}
	
	componentDidMount() {
		if (this.props.currentOrg) {
			this.props.getOrgDataQuality(this.props.currentOrg.org_id);
			this.props.getDQIprojectDetails(this.props.currentProject.project_id);
		}
	}

	static getDerivedStateFromProps = (nextProps) => {
		if (nextProps.refreshDashBoard) {
			nextProps.getOrgDataQuality(nextProps.currentOrg.org_id);
			nextProps.getDQIprojectDetails(nextProps.currentProject.project_id);
		}
		return null;
	};

	render() {
		return (
			<div>
				<ProjectChartList />
				<DQIDetailsContainer/>
			</div>
		)
	}
}

const mapStateToProps = state => {
	return {
		currentOrg: state.appData.currentOrg,
		currentProject: state.appData.currentProject,
		refreshDashBoard: state.dashboardData.refreshDashBoard
	};
};

const mapDispatchToProps = dispatch => ({
	getOrgDataQuality: (data) => dispatch(getOrgDataQuality(data)),
	getDQIprojectDetails: (data) => dispatch(getDQIprojectDetails(data))
});

export default connect(
	mapStateToProps,
	mapDispatchToProps
) (Dashboard);