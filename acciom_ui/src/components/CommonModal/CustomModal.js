import React from "react";
import {Button, Modal} from 'react-bootstrap';
import Tooltip from '@material-ui/core/Tooltip';
import { TextField } from '@material-ui/core';
import { DELETE, ADD, PROJNAME, PROJDESC, PROJNAMEINFO, PROJDESCINFO, TOOLTIP_TITLE, TOOLTIP_DESC, TEXTBOX_NAME,TEXTBOX_DESC, PROJECTS, ORGDESC,DELETEMSG, PROJECTITLE, TITLE, PROJECTDESC, ORGTITLE, ORJDESC, ORGNAME, DELETEORG, ORGANIZATION } from "../../constants/FieldNameConstants";

const customModal =(props)=>{

    const { classes,projectNameAdd,projectDescriptionAdd,variant,projectDescription,onYesBtnClicked,onCancelBtnClicked,onNoBtnClicked,onSaveBtnClicked,currentPage } = props;
    
    let projectNameValue =(   <Tooltip title={TOOLTIP_TITLE}>
    <TextField
     id={PROJNAMEINFO}
     placeholder={currentPage===PROJECTS?PROJNAME:ORGNAME}
     type="search"
     style ={{marginLeft:'20px'}}
     margin="normal"
     onChange ={props.onTextFieldHandler}
     value ={projectNameAdd}
     name={TEXTBOX_NAME}
     />

     </Tooltip>);
      if(projectNameAdd.length>0){
        projectNameValue=(
        <TextField
        id={PROJNAMEINFO}
        placeholder={currentPage===PROJECTS?PROJNAME:ORGNAME}
        type="search"
        style ={{marginLeft:'20px'}}
        margin="normal"
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
        placeholder={currentPage===PROJECTS?PROJDESC:ORJDESC}
        type="search"
        style ={{marginLeft:'20px'}}
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
        placeholder={currentPage===PROJECTS?PROJDESC:ORJDESC}
        type="search"
        style ={{marginLeft:'20px'}}
        margin="normal"
        onChange ={props.onTextFieldHandler}
        name={TEXTBOX_DESC}
        value ={projectDescriptionAdd}
    />  

    }
    return (
        <Modal show={true} className="deleteconfirmpopupbox" bsSize="medium">
            <Modal.Header className="popboxheader">
                <Modal.Title className="sub_title">
                {variant ===DELETE?TITLE: (variant ===ADD && currentPage===PROJECTS)?PROJECTITLE:ORGTITLE}
                </Modal.Title>
            </Modal.Header>

            <Modal.Body >
                <div className="deleteconfirmpopupfieldtext">
               
                  {(variant ===DELETE && currentPage===PROJECTS)?DELETEMSG:
                    (variant ===DELETE && currentPage===ORGANIZATION)?DELETEORG:
                    (variant ===ADD && currentPage===PROJECTS)?PROJECTDESC:
                    ORGDESC}
                  </div>
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
                {variant ===DELETE?'No':'Save'}
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