import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux';
import '../css/Db-ui-styles.css';
import { Link } from 'react-router-dom';
import { Panel, Table, Modal} from 'react-bootstrap';
import { getAllTestSuites } from '../actions/testSuiteListActions';
import EditIcon from '@material-ui/icons/Edit';
import { showProjectSwitchPage } from '../actions/appActions';
import BusinessCenterIcon from '@material-ui/icons/BusinessCenter';
import DeleteIcon from '@material-ui/icons/Delete';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import CustomTable from '../components/Table/CustomTable';
import {
    SUITENAMEID,
    SUITENAMELABEL,
    UPLOADATID,
    ACTION,
    UPLOADATLABEL,
    SMALL
} from '../constants/FieldNameConstants';

import Button from '@material-ui/core/Button';
export class ViewSuite extends Component {
    constructor(props) {
		super(props);
		this.state = {
			headers: [
                { id: SUITENAMEID, label: SUITENAMELABEL },
                {id: UPLOADATID, label: UPLOADATLABEL }
            ]
		};
    }
    

    componentDidMount(){
        console.log(this.props.currentProject)
    }

    static getDerivedStateFromProps = (nextProps, prevState) => {
		if (nextProps.refreshTestSuites) {
			nextProps.getAllTestSuites(nextProps.currentProject.project_id);
		}
        return null;
    }

    handleSwitchProject = () => {
		this.props.showProjectSwitchPage(true);
	};
    render() {
        const {headers} = this.state;
        const {suitelist} = this.props;

        const modifyBodyData = [];
        if(suitelist){
            suitelist.forEach((testsuitename, index)=>{
                modifyBodyData.push({
                    suite_name: testsuitename.test_suite_name,
                    upload_at: testsuitename.created_at,

                    action: (
						<Fragment>
							<Link to={`/clone-suite/${testsuitename.test_suite_id}`}>
                                <EditIcon
                                    fontSize={SMALL}
                                    className="editicon2"
                                    style={{
                                        color: '#696969',
                                        marginRight: '8px'
                                    }}
                                />
                            </Link>
							<DeleteIcon 
								className="cursorhover"
                                fontSize={SMALL}
                                style={{ color: '#696969', marginRight: '8px' }}
							/>
                            <Link to={`/clone-suite/${testsuitename.test_suite_id}`}>
                            <span ><FileCopyIcon fontSize="small"  style={{color:"#696969"}}/></span>
                            </Link>
						</Fragment>
					)
                })
            })
        }

        return (
                <div className="viewDbDetailsForm">
				<div className='btnContainer'>
                <BusinessCenterIcon className="manageSuitIcon" />
				<label className="db_page_title main_titles">Manage Test Suites</label>
					<div className='project-switch'><Button className="button-colors testSwitchProject" variant="contained" onClick={ (e) => this.handleSwitchProject()}>Switch Project</Button> </div>
                    <div className='project-switch'>
                    <Link to={"/create_suite"}>
                    <Button className="button-colors newSuite" type="button" variant="contained">New Suite</Button>
                    </Link>
                    </div>
				</div>
                <CustomTable 
                    headers={headers}
					bodyData={modifyBodyData}
					actionLabel={ACTION}
                />
            </div>
        )
    }
}

const mapStateToProps = (state) => {
	return {
        currentProject: state.appData.currentProject,
        refreshTestSuites: state.testSuites.refreshTestSuites,
        suitelist:state.testSuites.testSuiteList?state.testSuites.testSuiteList:[]

	};
};
const mapDispatchToProps = dispatch => ({
    getAllTestSuites: (data) => dispatch(getAllTestSuites(data)),
    showProjectSwitchPage: (data) => dispatch(showProjectSwitchPage(data)),
});


export default connect(
	mapStateToProps,
	mapDispatchToProps
)(ViewSuite);
