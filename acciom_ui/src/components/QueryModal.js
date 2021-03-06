import React,{Component} from 'react';
import { Modal} from 'react-bootstrap';
import '../css/Db-ui-styles.css';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
    
class RenderManageConnectionDialog extends Component{

constructor(props){
    super(props)
    this.state={
        "query":'',
        "type":"",
        "index":""
        
    }
}
componentDidMount() {
    console.log(this.props.connectionDetail)
    this.setState({
        "query":this.props.connectionDetail.Query,
       
        "type":this.props.connectionDetail.type,
        "index":this.props.connectionDetail.index
    })
}
handleInputChange = ({target}) =>{
    const { value} = target;
        this.setState({query:value})
        
    }


onYesBtnClickHandlers = () =>{
    this.props.onYesBtnClickHandler(false)
    this.props.QueryData(this.state)
 }
    onCloseBtnClickHandlers = () =>{
        this.props.onYesBtnClickHandler(false)

    }


    render(){
        // const inValid = !this.formValidation() && !this.ConnectionExists()
    return (

        <Modal show={true} className="deleteconfirmpopupbox" bsSize="large"
        onHide={ (e) => {this.onCloseBtnClickHandlers()}}>
            <Modal.Header closeButton={true} className="popboxheader">
                <Modal.Title className="sub_title">Write Query</Modal.Title>
            </Modal.Header>
        <Modal.Body >
        <div style={{margin:"20px"}}>
        <TextField 
        autoFocus={true}
        style={{justifyContent:'center'}}
        value={this.state.query}
        onChange={this.handleInputChange}
        multiline={true}
        placeholder="Enter Query here"
        fullWidth
      />

        </div>
        </Modal.Body>

            <Modal.Footer className="popboxfooter">
                <Button className="editSaveButton button-colors" variant="contained" 
                onClick={ (e) => {this.onYesBtnClickHandlers()}} >Save</Button>
                <Button className="editCloseButton backbutton_colors" variant="contained" 
                onClick={ (e) => {this.onCloseBtnClickHandlers()}}>Close</Button>
            </Modal.Footer>
        </Modal>
    )
    }
};


export default (RenderManageConnectionDialog);