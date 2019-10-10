import React from "react";
import {Button, Modal} from 'react-bootstrap';

const customModal =(props)=>{
    return (
        <Modal show={true} className="deleteconfirmpopupbox" bsSize="medium">
            <Modal.Header className="popboxheader">
                <Modal.Title className="sub_title">Confirmation</Modal.Title>
            </Modal.Header>

            <Modal.Body >
                <div className="deleteconfirmpopupfieldtext">Do you want to delete this DB connection?</div>
            </Modal.Body>

            <Modal.Footer className="popboxfooter">
                <Button className="onDeleteDbYesBtnClick button-colors" bsStyle="primary" onClick={props.onYesBtnClicked}>Yes</Button>
                <Button className="onDeleteDbNoBtnClick nobtnbgcolor" onClick={props.onNoBtnClicked}>No</Button>
            </Modal.Footer>
        </Modal>
      
    )

}

export default customModal;