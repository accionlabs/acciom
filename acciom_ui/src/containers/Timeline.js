import React, {Component} from 'react';

class TimeLineComponent extends Component {
	constructor(props){
		super(props);
		this.state = {
			open: true
		};
		this.togglePanel = this.togglePanel.bind(this);
	}

	togglePanel(e){
		this.setState({open: !this.state.open})
	}

	render() {
		return (
			<div className="col-md-4 col-sm-4 col-xs-12">
				<div className="x_panel">
					<div className="x_title">
						<h2 className="activityHeading">Recent Activities <small>Sessions</small></h2>
						<ul className="nav navbar-right panel_toolbox">
							<li>
								<a className="collapse-link">
									{this.state.open ? (<i className="fa fa-chevron-up" onClick={(e)=>this.togglePanel(e)}></i>) : (<i className="fa fa-chevron-down" onClick={(e)=>this.togglePanel(e)}></i>)}
								</a>
							</li>
							<li className="dropdown">
								<a href="#" className="dropdown-toggle" data-toggle="dropdown" role="button" aria-expanded="false"><i className="fa fa-wrench"></i></a>
								<ul className="dropdown-menu" role="menu">
								</ul>
							</li>
						</ul>
						<div className="clearfix"></div>
					</div>
					{ this.state.open ?  (<div className="x_content">
						<div className="dashboard-widget-content">

							<ul className="list-unstyled timeline widget">
								<li>
									<div className="block">
										<div className="block_content">
											<h2 className="title">
												<a>Project NRD</a>
											</h2>
											<p className="excerpt">
												<ul className="timeLineData">
													<li>User Russel added (2 Mins ago)</li>
													<li>Data Profile NRD was Run (8 Mins ago)</li>
													<li>1 New Rule(s) added to NRD data profiling (1 Day(s) ago)</li>
												</ul>
											</p>
										</div>
									</div>
								</li>
								<li>
									<div className="block">
										<div className="block_content">
											<h2 className="title">
												<a>Project EPICOR Active Customers</a>
											</h2>
											<p className="excerpt">
												<ul className="timeLineData">
													<li>Data Profile EPICOR Active was Run (1 Day(s) ago)</li>
													<li>2 New Rule(s) added to EPICOR Active data profiling (2 Day(s) ago)</li>
												</ul>
											</p>
										</div>
									</div>
								</li>
								<li>
									<div className="block">
										<div className="block_content">
											<h2 className="title">
												<a>Project EPICOR Georgia</a>
											</h2>
											<p className="excerpt">
												<ul className="timeLineData">
													<li>Data Profile EPICOR Georgia was Run (2 Day(s) ago)</li>
													<li>4 New Rule(s) added to EPICOR Georgia data profiling (2 Day(s) ago)</li>
												</ul>
											</p>
										</div>
									</div>
								</li>
							</ul>
						</div>
					</div>) : null}
				</div>
			</div>
		)
	}
}

export default TimeLineComponent;