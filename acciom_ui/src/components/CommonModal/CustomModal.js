import React from "react";
import {Button, Modal} from 'react-bootstrap';
import Tooltip from '@material-ui/core/Tooltip';
import { TextField } from '@material-ui/core';
import { DELETE, ADD, PROJNAME, PROJDESC, PROJNAMEINFO, PROJDESCINFO, TOOLTIP_TITLE, TOOLTIP_DESC, TEXTBOX_NAME,TEXTBOX_DESC, PROJECTS,DELETEMSG, TITLE, ORJDESC, ORGNAME, DELETEORG, ADDORGANIZATION, ADDPROJECT } from "../../constants/FieldNameConstants";

const customModal =(props)=>{

    const { classes,projectNameAdd,projectDescriptionAdd,variant,projectDescription,onYesBtnClicked,onCancelBtnClicked,onNoBtnClicked,onSaveBtnClicked,currentPage } = props;
    
    let projectNameValue =(   <Tooltip title={TOOLTIP_TITLE}>

     <TextField
        id={PROJNAMEINFO}
        label={currentPage===PROJECTS?PROJNAME:ORGNAME}
        margin="normal"
        style ={{marginLeft:'20px',marginTop:'-13px'}}
        onChange ={props.onTextFieldHandler}
        value ={projectNameAdd}
        name={TEXTBOX_NAME}
      />
     </Tooltip>);
      if(projectNameAdd.length>0){
        projectNameValue=(
       
       <TextField
        id={PROJNAMEINFO}
        label={currentPage===PROJECTS?PROJNAME:ORGNAME}
        margin="normal"
        style ={{marginLeft:'20px',marginTop:'-13px'}}
        onChange ={props.onTextFieldHandler}
        value ={projectNameAdd}
        name={TEXTBOX_NAME}
      />
       )
    }
    let projectDescriptionValue =(
        <Tooltip title ={TOOLTIP_DESC}>
        
        <TextField
        id={PROJDESCINFO}
        label={currentPage===PROJECTS?PROJDESC:ORJDESC}
        style ={{marginLeft:'20px',marginTop:'-13px'}}
        margin="normal"
        onChange ={props.onTextFieldHandler}
        name={TEXTBOX_DESC}
        value ={projectDescriptionAdd}
      />
        </Tooltip>
       
      );
      if(projectDescriptionAdd.length>0){
        projectDescriptionValue= 
    
    <TextField
    id={PROJDESCINFO}
    label={currentPage===PROJECTS?PROJDESC:ORJDESC}
    style ={{marginLeft:'20px',marginTop:'-13px'}}
    margin="normal"
    onChange ={props.onTextFieldHandler}
    name={TEXTBOX_DESC}
    value ={projectDescriptionAdd}
  /> 

    }
    return (
        <Modal show={true} className="deleteconfirmpopupbox" bsSize="medium">
            <Modal.Header className="popboxheader">
                {/* <Modal.Title className="sub_title"> */}
                <Modal.Title className={variant ===DELETE?"sub_title":'sub_title_add'}>
                {variant ===DELETE?TITLE: (variant ===ADD && currentPage===PROJECTS)?ADDPROJECT:ADDORGANIZATION}
                </Modal.Title>
            </Modal.Header>
      
         <Modal.Body >
         {variant ==DELETE?
         <div className="deleteconfirmpopupfieldtext">
        
                    {currentPage===PROJECTS?DELETEMSG:
                DELETEORG
            }
           </div>:null
         }
     </Modal.Body>
      
         
            {
                variant ===ADD?
                <div>
                {projectNameValue}
                {projectDescriptionValue}
      
              </div>:null
            }
          
            <Modal.Footer className="popboxfooter">
                <Button className="onDeleteDbYesBtnClick button-colors" 
                bsStyle="primary" 
                onClick={variant ===DELETE?onYesBtnClicked:onCancelBtnClicked}>
                {variant ===DELETE?'Yes':'Cancel'}
                </Button>
                <Button className="onDeleteDbNoBtnClick nobtnbgcolor" 
                onClick={variant ===DELETE?onNoBtnClicked:onSaveBtnClicked}>
                {variant ===DELETE?'No':'Add'}
                    </Button>
            </Modal.Footer>
        </Modal>
      
    )

}
customModal.defaultProps = {
    projectNameAdd: '',
    projectDescriptionAdd: '',
   
}
//
export default customModal;