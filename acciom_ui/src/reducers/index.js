import { combineReducers } from 'redux';
import testSuites from './testSuitesReducer';
import appData from './appReducer';
import testSuiteUploadData from './testSuiteUploadReducer';
import loginData from './loginReducer';
import dashboardData from './dashboardReducer';
import dbDetailsData from './dbDetailsReducer';
import userManagementData from './userManagementReducer';
import projectManagementData from './projectManagementReducer';
import organizationManagementData from './organizationManagementReducer';
import roleManagementData from './roleManagementReducer';

const rootReducer = combineReducers({
	appData,
	loginData,
	dashboardData,
	testSuites,
	testSuiteUploadData,
	dbDetailsData,
	userManagementData,
	projectManagementData,
	organizationManagementData,
	roleManagementData
});

export default rootReducer;
