import React, { Component } from 'react';
import { Modal, Button } from 'react-bootstrap';

let dialogStyles = {
    width: '500px',
    maxWidth: '100%',
    margin: '0 auto',
    position: 'fixed',
    left: '50%',
    top: '50%',
    transform: 'translate(-50%,-50%)',
    zIndex: '999',
    backgroundColor: '#eee',
    padding: '10px 20px 40px',
    borderRadius: '8px',
    display: 'flex',
    flexDirection: 'column'
};

let dialogCloseButtonStyles = {
    marginBottom: '15px',
    padding: '3px 8px',
    cursor: 'pointer',
    borderRadius: '50%',
    border: 'none',
    width: '30px',
    height: '30px',
    fontWeight: 'bold',
    alignSelf: 'flex-end'
};


class Dialog extends React.Component {

    constructor(props) {
        super(props);
    }
   
    render() {

        let dialog = (
            <div style={dialogStyles}>
                <button style={dialogCloseButtonStyles} onClick={this.props.onClose}>x</button>

                <div></div>
            </div>
        );

        if (! this.props.isOpen) {
            dialog = null;
        }
       

        
      

        return (
            <div>
        
      <Modal >
        <Modal.Header >
          <Modal.Title>Modal heading</Modal.Title>
        </Modal.Header>
        <Modal.Body>Woohoo, you're reading this text in a modal!</Modal.Body>
        <Modal.Footer>
         
        </Modal.Footer>
      </Modal>
                
            </div>
        );
    }
}

export default Dialog;
