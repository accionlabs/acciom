import React from 'react';
import '../css/card.css';

function Cards () {
	return (
		<div>
			<div className="row cardContainer">
				<div className="col-md-3">
					<div className="card-counter info">
						<i className="fa fa-database"></i>
						<span className="count-numbers">72</span>
						<span className="count-name">projects</span>
					</div>
				</div>

				<div className="col-md-3">
					<div className="card-counter info">
						<i className="fas fa-chart-bar"></i>
						<span className="count-numbers">12</span>
						<span className="count-name">Scheduled Runs</span>
					</div>
				</div>

				<div className="col-md-3">
					<div className="card-counter info">
						<i className="fa fa-users"></i>
						<span className="count-numbers">272</span>
						<span className="count-name">Users</span>
					</div>
				</div>
			</div>
		</div>
	);
}

export default Cards;