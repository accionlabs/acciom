import React,{Component} from 'react';
import { Panel, Table, Button, Modal,FormGroup, ControlLabel, FormControl, Form, Col} from 'react-bootstrap';
import '../css/Db-ui-styles.css';
import { connect } from 'react-redux';
import { getAllDBTypes } from '../actions/dbDetailsActions';
import Select from 'react-select';
import { 
	getAllConnections
} from '../actions/testSuiteListActions';

    class RenderManageConnectionDialog extends Component{

constructor(props){
    super(props)
    this.state={
        "source_db_connection_id":'',
        "source_db_type":'',
	    "source_db_name":'',
        "source_db_server":'',
        "source_db_username":'',
        "ConnectionType":''
    }
}
componentDidMount() {
    this.props.getAllDBTypes()
    this.setState({
        "source_db_type":'',
	    "source_db_name":'',
        "source_db_server":'',
        "source_db_username":'',
        "index":this.props.connectionDetail.index,
        "type":this.props.connectionDetail.type
    })
    this.props.getAllConnections(this.props.currentProject.project_id)
}


formValidation = () => {
    return [
        this.state.source_db_name,
        this.state.source_db_server,
        this.state.source_db_username
    ].every(Boolean);
};
ConnectionExists = () =>{
    return this.state.source_db_connection_id == ''?false:true
}

    onYesBtnClickHandlers = () =>{
       this.props.onYesBtnClickHandler(false)
       this.props.ConnectionData(this.state)
    }
    onCloseBtnClickHandlers = () =>{
        this.props.onYesBtnClickHandler(false)

    }
    handleInputChange = ({target}) =>{
        const { value, name } = target;
        switch (name){
            case "db_type":
            this.setState({source_db_type:value})
            break;
            case "db_name":
            this.setState({source_db_name:value})
            break;
            case "db_hostname":
            this.setState({source_db_server:value})
            break;
            case "db_username":
            this.setState({source_db_username:value})
            break;
            default:
            break;
        }

       
    }
    handleDBTypeChange = (e) => {
		this.setState({source_db_type: e.label,source_db_connection_id:''});
    };
    
    renderDBTypes = () =>{
        const options = this.props.dbTypesList.map((item) => {
            return { value: Object.keys(item)[0], label:item[Object.keys(item)[0]]} ;
        });
        return options;
    }
    renderExistingDBTypes = () =>{
        const options = this.props.allConnections.map((item,key) => {
            return { value: item.db_connection_id, label:item.db_connection_name} ;
        });
        return options;
    }
    handleExistingDBTypeChange = (item) =>{
        this.setState({source_db_connection_id:item.value})
    }


    render(){
        const inValid = !this.formValidation() && !this.ConnectionExists()
        const ConnectionSelected = this.ConnectionExists();
    return (

        <Modal show={true} className="deleteconfirmpopupbox" bsSize="medium">
            <Modal.Header closeButton={true} className="popboxheader">
                <Modal.Title className="sub_title">Manage Connection</Modal.Title>
            </Modal.Header>
        <Modal.Body >
        <div >
        <Form className="adddblabels" noValidate  horizontal>
            <FormGroup controlId="formControlsDbType">
            <Col sm={4}><ControlLabel>Existing Connections</ControlLabel></Col>
            <Col sm={8}>
            <Select 
                    theme={theme => ({ ...theme, borderRadius: 5, colors: { ...theme.colors, primary25: '#f4cdd0', primary: '#dee0e2',primary50: '#dee0e2' }, })}
                    value={this.source_db_connection_id}
                    onChange={ (item) => this.handleExistingDBTypeChange(item) }
                    options= { this.renderExistingDBTypes() }
                    />
                    </Col>
            </FormGroup >

            <FormGroup controlId="formControlsDbType">
            <Col sm={4}><ControlLabel>Database Type</ControlLabel></Col>
            <Col sm={8}>
            <Select 
                    theme={theme => ({ ...theme, borderRadius: 5, colors: { ...theme.colors, primary25: '#f4cdd0', primary: '#dee0e2',primary50: '#dee0e2' }, })}
                    value={this.source_db_type}
                    onChange={ (item) => this.handleDBTypeChange(item) }
                    options= { this.renderDBTypes() }
                    />
                    </Col>
            </FormGroup >
            <FormGroup controlId="formControlsDbName">
                <Col sm={4}><ControlLabel>Database Name</ControlLabel></Col>
                <Col sm={8}><FormControl type="textbox" disabled={ConnectionSelected} name="db_name" maxlength="50" value={this.state.source_db_name}
                 onChange={this.handleInputChange} /></Col>
            </FormGroup >
            <FormGroup controlId="formControlsHostName">
                <Col sm={4}><ControlLabel>Host Name</ControlLabel></Col>
                <Col sm={8}><FormControl disabled={ConnectionSelected} type="textbox" name="db_hostname" maxlength="50" value={this.state.source_db_server} 
                 onChange={this.handleInputChange} /></Col>
            </FormGroup >
            <FormGroup controlId="formControlsUsername">
                <Col sm={4}><ControlLabel>User Name</ControlLabel></Col>
                <Col sm={8}><FormControl disabled={ConnectionSelected} type="textbox" name="db_username" maxlength="50" value={this.state.source_db_username}
                 onChange={this.handleInputChange} /></Col>
            </FormGroup >
        </Form>
        </div>
        </Modal.Body>

            <Modal.Footer className="popboxfooter">
                <Button className="onDeleteDbYesBtnClick button-colors" bsStyle="primary" 
                onClick={ (e) => {this.onYesBtnClickHandlers()}} disabled={inValid}>Save</Button>
                <Button className="onDeleteDbYesBtnClick button-colors" bsStyle="primary" 
                onClick={ (e) => {this.onCloseBtnClickHandlers()}}>Close</Button>
            </Modal.Footer>
        </Modal>
    )
    }
};

const mapStateToProps = (state) => {
	return {
		dbTypesList: state.dbDetailsData.dbTypeList?state.dbDetailsData.dbTypeList: [],
		allConnections : state.testSuites.connectionsList && 
		state.testSuites.connectionsList.allConnections? state.testSuites.connectionsList.allConnections : [],
	};
};

const mapDispatchToProps = dispatch => ({
    getAllConnections:(data)=>dispatch(getAllConnections(data)),
	getAllDBTypes: () => dispatch(getAllDBTypes()),

});
export default  connect(mapStateToProps, mapDispatchToProps)(RenderManageConnectionDialog);