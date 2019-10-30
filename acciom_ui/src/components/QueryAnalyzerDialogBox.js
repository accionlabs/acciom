import React ,{ Component} from 'react';
import { Panel, Table, Button, Modal} from 'react-bootstrap';

let dialogStyles ={
    width: '500px',
    maxWidth: '100%',
    margin: '0 auto',
    position: 'fixed',
    left: '50%',
    top: '50%',
    transform: 'translate(-50%,-50%)',
    zIndex: '999',
    backgroundColor: 'darkgrey',
    padding: '10px 20px 40px',
    borderRaadius: '8px',
    dislay: 'flex',
    flexDirection: 'column'
};
let dialogCloseButtonStyles={
    backgroundColor: 'BD4951',
    marginBottom: '15px',
    adding: '3px 8px',
    cursor: 'pointer',
    borderRaadius: '50%',
    border: 'none',
    width: '30px',
    height: '30px',
    fontWeight: 'bold',
    alignSelf: 'flex-end'
}
 export default class QueryAnalyzerDialogBox extends Component {
     render() {
         let dialog = (
            <Modal show={true} className="deleteconfirmpopupbox" bsSize="medium">
				<Modal.Header className="popboxheader">
					
				</Modal.Header>

				<Modal.Body >
					<div className="deleteconfirmpopupfieldtext">{this.props.children}</div>
				</Modal.Body>
                <Modal.Footer>
                        <button style={dialogCloseButtonStyles} onClick={this.props.onDialogBoxClose}>X</button>
                </Modal.Footer>
			</Modal>
         );
         if(this.props.isDialogOpen){
             dialog=null
         }
         return(
            <div>
                {dialog}
            </div>
         )
     }
 }

//  <div style={dialogStyles}>
//                 <button style={dialogCloseButtonStyles} onClick={this.props.onDialogBoxClose}>X</button>
//                 <div>{this.props.children}</div>
//             </div>