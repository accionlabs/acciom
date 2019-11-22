import React from 'react';
import { connect } from 'react-redux';
import XLSX from 'xlsx';
import { Panel, Tabs, Tab} from 'react-bootstrap';
import { showProjectSwitchPage } from '../actions/appActions';
import Button from '@material-ui/core/Button';
import PublishIcon from '@material-ui/icons/Publish';
import Paper from '@material-ui/core/Paper';
import { 
	onTestSuiteSheetSelect, 
	testCaseSelectionChange, 
	testCaseSelectAllToggle,
	testSuiteFileUploadSuccess,
	testSuiteSheetloadSuccess,
	uploadTestCases,
	resetTestSuiteUploadData, 
	onSheetNameChange,
	resetDataForSheetPage,
	resetDataForCasePage
} from '../actions/testSuiteUploadActions';
import { 
	getAllTestSuites,
} from '../actions/testSuiteListActions';
import { getAllDBDetails } from '../actions/dbDetailsActions';
import { red } from '@material-ui/core/colors';

import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Table from '@material-ui/core/Table';
import Checkbox from '@material-ui/core/Checkbox';
import TextField from '@material-ui/core/TextField';

const TAB_UPLOAD_FILE = 1;
const TAB_UPLOAD_SHEET = 2;
const TAB_UPLOAD_CASES = 3;

class TestSuiteUpload extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			key: TAB_UPLOAD_FILE,
			sheets:[]
		};
		this.testSuiteFile = null;
		this.selectedSheet = null;
		this.workbook = {};
		this.pages = [];
		this.isNameAlreadyExist = false;
	}

	componentDidMount() {
		this.props.resetTestSuiteUploadData();
	}

	static getDerivedStateFromProps = (nextProps, prevState) => {
		let newState = prevState;

		if (nextProps.moveToSelectSheetPage) {
			newState = { ...prevState, key: TAB_UPLOAD_SHEET };
			nextProps.resetDataForSheetPage();
			nextProps.onSheetSelect(
				nextProps.pages && nextProps.pages.length > 0 
				?
				nextProps.pages[0]:[])
		} else if (nextProps.moveToSelectCasePage) {
			newState = { ...prevState, key: TAB_UPLOAD_CASES };
			nextProps.resetDataForCasePage();
			let project_id = nextProps.currentProject.project_id;
			nextProps.getAllTestSuites(project_id);
			
		} else if (nextProps.redirectToSuiteList) {
			nextProps.history.push('/startup');
		} 
		return newState;
	}

	loadTestSuiteFile = (selectedFiles) => {
		const file = selectedFiles[0];
		const fileReader = new FileReader();
	
		fileReader.onload = (evt) => {
			const arrayBuffer = fileReader.result;
			const data = new Uint8Array(arrayBuffer);
			const arr = [];
	
			for (let i = 0; i !== data.length; ++i) {
				arr[i] = String.fromCharCode(data[i]);
			}
			
			const bstr = arr.join("");
			this.workbook = XLSX.read(bstr, {type:"binary"});
	
			if (typeof this.pages !== 'undefined' && this.pages.length > 0) {
				this.pages = [];
			}
	
			for ( let x=0; x!==data.length; x++) {
				if (!this.workbook.SheetNames[x]) {
					break;
				} else {
					this.pages.push(this.workbook.SheetNames[x]);
				}
			}
			this.props.testSuiteFileUploadSuccess(this.pages, selectedFiles[0].name);
		};
	
		this.testSuiteFile = file;
		fileReader.readAsArrayBuffer(file);
	};
	
	goToBackBtnPage = () => {
        this.props.history.goBack();
    };

	loadTestSuiteSheet = (page) => {
		this.selectedSheet = page;
		const index = this.pages.findIndex(page_p=>page_p===page);
		const sheetName = this.workbook.SheetNames[index];
		const sheet = this.workbook.Sheets[sheetName];
		const resfinal = (XLSX.utils.sheet_to_json(sheet, {raw:true}));
		
		const dbDetailsList = [];
		const allCases = [];
	
		for (let i=0; i<resfinal.length; i++)
		{
			dbDetailsList.push(resfinal[i]['DB Details']); //TO DO:HARD CODED.['Test Class']
			allCases.push({'id':i,'name':resfinal[i]['Test Class'],'selected':false, 'description':resfinal[i]['Description']});
		}
	
		this.props.testSuiteSheetloadSuccess({ dbDetailsList, allCases });
	};

	getPostFilePayloadData = (fileToUpload, selectedSheet, selectedCase, suiteName, executeValue, projectId) => {
		const payload = new FormData();
		payload.append('inputFile',fileToUpload);
		payload.append('sheet_name',selectedSheet);
		payload.append('case_id_list',selectedCase);
		payload.append('suite_name',suiteName);
		payload.append('upload_and_execute',executeValue);
		payload.append('project_id', projectId);
		return payload;
	};

	onUploadBtnClick = (mode) => {
		let suiteName = '';
		const selectedTestCases = [];

		this.props.allCases.forEach((item) => {
			if (item.selected) {
				selectedTestCases.push(item.id);
			}
		});

		this.props.pages.forEach((item) => {
			if (item.selected) {
				suiteName = item.displayName;
			}
		});

		const projectId = this.props.currentProject.project_id;
		const body = this.getPostFilePayloadData(this.testSuiteFile, this.selectedSheet, selectedTestCases, suiteName, mode, projectId);
		
		this.props.uploadTestCases(body);
		this.props.getAllTestSuites(projectId);
	};

	render() {
		console.log("this.props.history", this.props.history)
		const MODE_UPLOAD = 0;
		const MODE_UPLOAD_AND_EXECUTE = 1;

		const handleTestSuiteUploadClick = () => {
			document.getElementById("testSuiteUploadFile").click();
		};

		const handleChange = (event) => {
			const selectedFiles = event.target.files;
			if (selectedFiles) {
				this.loadTestSuiteFile(selectedFiles);	
			}
		};

		const handleSheetCheckChange = (page) => {
			this.props.onSheetSelect(page);
		};

		const onContinueClick = (event) => {
			this.props.pages.forEach(page => {
				if (page.selected) {
					this.loadTestSuiteSheet(page.name);
				}
			});
		};

		const handleTestCaseCheckChange = (testCase) => {
			this.props.testCaseSelectionChange(testCase);
		};

		const handleSelectAllChange = () => {
			this.props.testCaseSelectAllToggle();
		};

		const checkNameAlreadyExist = (testSuites,displayName) => {
			let isNameAlreadyExist = false;
			for(let data of testSuites ){
				if(data.test_suite_name === displayName){
					isNameAlreadyExist = true;
					break;
				}
			}
			return isNameAlreadyExist;
		}

		const handleInputChange = (e, index) => {
		
			let testSuites = this.props.testSuites;
			let displayName = e.target.value;
		

			this.props.onSheetNameChange({sheetIndex:index,  displayName: e.target.value});
			this.isNameAlreadyExist = checkNameAlreadyExist(testSuites,displayName);
			
		};

		const getSheetsList = () => {
			let element;
			let sheets = this.state.sheets;
			if (this.props.pages.length > 0) {
				const sheetList = this.props.pages.map((page, index) => {
					sheets[index] = {
						name: page.name
					};
					return (
						<div key={index} className='sheetListItem'>
							<label className="form-check-label updatedataprofillabel">
								<Checkbox
									className="form-check-input"
									value={page.name}
									checked={page.selected}
									onChange={ (e) => handleSheetCheckChange(page)}
								/>
								{page.name}
							</label>
						</div>
					);
				});

				element = (
					<div>
						<h5 className="margin-title">Please select the sheet to be loaded</h5>
						<div>{ sheetList } </div>
						<div className="margin-button">
							<Button variant="contained" onClick={this.goToBackBtnPage} className="backbutton_colors uploadBackButton">Back</Button>
							<Button variant="contained" className="button-colors uploadBrowsButton" onClick={ (e) => onContinueClick()}>Load Test Cases</Button> 
						</div>
					</div>
				);
			}
			return element;
		};

		const getTestCasesList = () => {
			let testCasesList = [];
			if (this.props.allCases && this.props.allCases.length > 0) {
				testCasesList = this.props.allCases.map((testCase, index) => {
					return (
						<TableRow key={index}>
							<TableCell>{testCase.description}</TableCell>
							<TableCell>{testCase.name}</TableCell>
							<TableCell>
								<Checkbox
									value={testCase.selected}
									id={testCase.name}
									name={testCase.name}
									checked={testCase.selected}
									onChange={ (e) => handleTestCaseCheckChange(testCase)}
								/>
							</TableCell>
						</TableRow>	
					)
				});
				
				return (
					<div className='testCaseListContainer'>
						<Paper className="uploadPaperSuite">
						<div className="testSuitBodyScroll">
								<Table>
									<TableHead className="uploadDatapfrofilingtable">
										<TableRow>
											<TableCell className="uploadDataCheckBox">Test Case Description</TableCell>
											<TableCell className="uploadDataCheckBox">Test Class</TableCell>
											<TableCell className="uploadDataCheckBox">
												<Checkbox 
													onChange={ (e) => handleSelectAllChange()}
													value="Select All"
													id="Select All"
												/>Select All
											</TableCell>
										</TableRow>
									</TableHead>
									<TableBody className="table_body-new-suite table_body">
										{testCasesList}
									</TableBody>
								</Table>
								</div>
								<div className="uploadButtonDiv">
									<Button variant="contained" onClick={this.goToBackBtnPage} className="backbutton_colors uploadBackButton">Back</Button> 
									<Button variant="contained" className="button-colors updateandexcbtn" onClick={ (e) => this.onUploadBtnClick(MODE_UPLOAD_AND_EXECUTE)} disabled={this.isNameAlreadyExist || !isValid()}>Upload and Execute</Button>								
									<Button variant="contained" className="button-colors uploadbtn" onClick={ (e) => this.onUploadBtnClick(MODE_UPLOAD)} disabled={this.isNameAlreadyExist || !isValid()}>Upload</Button>
								</div>
								</Paper>
								</div>
				)
			}
		};

		const renderTestSuiteName = () => {
			let element = null;
			let testSuites = this.props.testSuites;
			let i;
			let pages = this.props.pages;
			let selectedPage;
			if(pages.length > 0) {
				for(i=0; i<=pages.length; i++) {
					let page = pages[i];
					if(page && page.selected) {
						selectedPage = page;
						break;
					}
				}
				let displayName = selectedPage ? selectedPage.displayName : '';
				this.isNameAlreadyExist = checkNameAlreadyExist(testSuites,displayName);
				element = (
					<div className="uploadTestSuitNameMargin">
						<TextField 
							label = "Test Suite Name"
							className= "uploadTestSuitName"
							maxlength="50"
							onChange={e => handleInputChange(e,i)} 
							value={ displayName }
						/>
						{this.isNameAlreadyExist &&
							<span className="uploadTestSuitLabel">Test suite Name already exist</span>
						}
					</div>
				);
			}
			return element;
		}

		const handleSelect = (key) => {
			this.setState({ key });
		};

		const handleSwitchProject = () => {
			this.props.showProjectSwitchPage(true);
		};
		
		const isValid = () => {
			return this.props.allCases.some((data) => {
				return data.selected === true
			})
		}
		return (
			
			<div id="suite-upload">
				<div>
					<PublishIcon className="uploadicon" />
					<h4 className='pageTitle update-data-profiling-title main_titles'>Update Data Profiling</h4>
					<Button variant="contained" className="button-colors brows-btn" onClick={ (e) => handleSwitchProject()}>Switch Project</Button>
				</div>
				
				<Tabs activeKey={this.state.key} onSelect={handleSelect} id="controlled-tab-example" >
					<Tab className="updatedataprofilingtab" eventKey={TAB_UPLOAD_FILE} title="Upload Data Profiling">
						<div className='testSuiteUploadOptions'>
							<div className="hideElement">
								<input  id="testSuiteUploadFile" type="file" className="file" placeholder="Upload file" accept=".xlsx" 
									onChange={ (e) => handleChange(e)}/>
							</div>
							<TextField 
								placeholder="&nbsp; example.xlsx"
								value={this.props.file}
								disabled
								className="browse-txt"
							/>
							<div className="updateBrowsButton">
							<Button variant="contained" onClick={this.goToBackBtnPage} className="backbutton_colors uploadBackButton">Back</Button>
							<Button variant="contained" className="button-colors uploadBrowsButton" onClick={ (e) => handleTestSuiteUploadClick()}>Browse File</Button>
							</div>						
						</div>
					</Tab>
			
					<Tab eventKey={TAB_UPLOAD_SHEET} title="Select Sheet" disabled={this.props.isSheetListPageDisabled}>
						{ getSheetsList() }
					</Tab>

					<Tab eventKey={TAB_UPLOAD_CASES} title="Select Test Cases" disabled={this.props.isCaseListPageDisabled}>
						<div>
							{ renderTestSuiteName() }
						</div>
						{ getTestCasesList() }
					</Tab>
				</Tabs>
				</div>
		)
	}
}

const mapStateToProps = (state) => {
	return {
		currentProject: state.appData.currentProject,
		pages: state.testSuiteUploadData? state.testSuiteUploadData.sheets : [],
		file: state.testSuiteUploadData.file,
		allCases: state.testSuiteUploadData && 
		state.testSuiteUploadData.sheetData ? state.testSuiteUploadData.sheetData.allCases : [],
		selectAll: state.testSuiteUploadData ? state.testSuiteUploadData.selectAll : false,
		isUpdateSuitePageDisabled: state.testSuiteUploadData.isUpdateSuitePageDisabled,
		isSheetListPageDisabled: state.testSuiteUploadData.isSheetListPageDisabled,
		isCaseListPageDisabled: state.testSuiteUploadData.isCaseListPageDisabled,
		moveToSelectSheetPage: state.testSuiteUploadData.moveToSelectSheetPage,
		moveToSelectCasePage: state.testSuiteUploadData.moveToSelectCasePage,
		redirectToSuiteList: state.testSuiteUploadData.redirectToSuiteList,
		testSuites: state.testSuites.testSuiteList? state.testSuites.testSuiteList: [],
	};
};

const mapDispatchToProps = dispatch => ({
	testSuiteFileUploadSuccess: (data) => dispatch(testSuiteFileUploadSuccess(data)),
	testSuiteSheetloadSuccess: (data) => dispatch(testSuiteSheetloadSuccess(data)),
	onSheetSelect: (data) => dispatch(onTestSuiteSheetSelect(data)),
	uploadTestCases: (data) => dispatch(uploadTestCases(data)),
	testCaseSelectionChange: (data) => dispatch(testCaseSelectionChange(data)),
	testCaseSelectAllToggle: () => dispatch(testCaseSelectAllToggle()),
	resetTestSuiteUploadData: () => dispatch(resetTestSuiteUploadData()),
	showProjectSwitchPage: (data) => dispatch(showProjectSwitchPage(data)),
	onSheetNameChange: (data) => dispatch(onSheetNameChange(data)),
	resetDataForSheetPage: () => dispatch(resetDataForSheetPage()),
	resetDataForCasePage: () => dispatch(resetDataForCasePage()),
	getAllTestSuites  : (data)=> dispatch(getAllTestSuites(data)),
	getAllDBDetails: (data)=> dispatch(getAllDBDetails(data))
});

export default connect(
	mapStateToProps,
	mapDispatchToProps
) (TestSuiteUpload);