import React from "react";
import {Button, Modal} from 'react-bootstrap';
import { TextField } from '@material-ui/core';
import { DELETE, ADD, PROJNAME, PROJDESC, PROJNAMEINFO, PROJDESCINFO, TOOLTIP_TITLE, TOOLTIP_DESC, TEXTBOX_NAME,TEXTBOX_DESC, PROJECTS,DELETEMSG, TITLE, ORJDESC, ORGNAME, DELETEORG, ADDORGANIZATION, ADDPROJECT } from "../../constants/FieldNameConstants";

const customModal =(props)=>{

    const { projectNameAdd,projectDescriptionAdd,variant,projectDescription,onYesBtnClicked,onCancelBtnClicked,onNoBtnClicked,onSaveBtnClicked,currentPage,validateFields } = props;
  
    let projectNameValue =(   
 
        <TextField
        id={PROJNAMEINFO}
        label={currentPage===PROJECTS?PROJNAME:ORGNAME}
        margin="normal"
        style ={{marginLeft:'20px',marginTop:'11px'}}
        onChange ={props.onTextFieldHandler}
        value ={projectNameAdd}
        name={TEXTBOX_NAME}
        autoFocus 
      />
  
     );
   
    let projectDescriptionValue =(
      
        <TextField
        id={PROJDESCINFO}
        label={currentPage===PROJECTS?PROJDESC:ORJDESC}
        style ={{marginLeft:'20px',marginTop:'11px'}}
        margin="normal"
        onChange ={props.onTextFieldHandler}
        name={TEXTBOX_DESC}
        value ={projectDescriptionAdd}
       
      />
     
       
      );

    return (
        <Modal show={true} className="deleteconfirmpopupbox" bsSize="medium">
            <Modal.Header className="popboxheader">
                <Modal.Title className="sub_title">
               
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
                onClick={variant ===DELETE?onNoBtnClicked:onSaveBtnClicked}
                disabled={variant===ADD && !validateFields}>
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
export default customModal;