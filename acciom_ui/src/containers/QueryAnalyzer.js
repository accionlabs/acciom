import React, { Component } from 'react';
import { connect } from 'react-redux';
import QueryAnalyzerTable from '../components/QueryAnalyzerTable';
import { Modal, Button } from 'react-bootstrap';
// import QueryAnalyzerDialogBox from '../components/QueryAnalyzerDialogBox'
import { getSelectedDatabaseType } from '../actions/queryAnalyzerActions';
import CustomPaginationActionsTable from '../components/Tables';
import Paper from '@material-ui/core/Paper';
import { 
	getAllConnections, 
} from '../actions/testSuiteListActions';


class QueryAnalyzer extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            table: false,
            QueryAnalyzerClicked: false,
            db_connection_id:null,
            query_text:'',
            isDialogOpen: false
         };
    }

    componentDidMount() {
        if(this.props.currentProject){
            console.log("26")
            console.log(this.props.currentProject)
            this.props.getAllConnections(this.props.currentProject)
        }
    }
    handleConnectionChange =(e) => {
        
        console.log(e.target.value)
        this.setState({
            db_connection_id:e.target.value
        })}
    onRunQueryClick = (e) => {
        console.log('Run Query Clicked !!');
    let querybody = {
        'project_id':this.props.currentProject.project_id,
        'db_connection_id':this.state.db_connection_id,
        'query':this.state.query_text
    }
    this.props.runQuery(JSON.stringify(querybody));
}

handleQueryTextChange = (e) =>{
    this.setState({
        query_text: e.target.value
      });
    //   console.log(this.state.query_text)
}
handleDialogBox = (e) => {
    this.setState({isDialogOpen: true});
    // alert("this.state.query_text");
    // SFCDZX// }
}
 createData(name, calories, fat, carbs, protein) {
    return { name, calories, fat, carbs, protein };
  }
  
  

    render() {
        const rows = [
            this.createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
            this.createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
              // createData('Eclair', 262, 16.0, 24, 6.0),
              // createData('Cupcake', 305, 3.7, 67, 4.3),
              // createData('Gingerbread', 356, 16.0, 49, 3.9),
          ];
         return (
            <div className='queryAnalyzer'>
                <h3>Analyse Queries</h3>
               <div className='queryAnalElemment'>
                <div>Query</div>
                <div>
                    <select onChange={this.handleConnectionChange}>
                        <option value="" disabled></option>
                                    { this.props.allConnections.map(connection => (
                                        connection ?
                                            <option key={connection.db_connection_id} value={connection.db_connection_id} >{connection.db_connection_name}</option> : null
                                    ))
								}
                    </select>
                </div>
                <div>
                    <textarea value={this.state.query_text} onChange={this.handleQueryTextChange} rows="6" cols="70"></textarea>
                    <button className='runQuery' onClick={this.onRunQueryClick}>Run Query</button>
                </div>
                <div>
                    <button className='queryAnalDeleteTableBtn'>X</button>
                    <button className='queryAnalExportBtn'>Export</button>
                    <button className='queryAnalExportPopUp' onClick={this.handleDialogBox}>PopUp</button>
                   
                    
                    {/* {this.handleDialogBox} */}
                    {/* <div>{this.state.query_text}</div> */}
                
                </div>
                <div>
                    <tr className='queryAnalTable'>
                        <QueryAnalyzerTable rows={rows} />
                    </tr>
                   
                </div>
               </div>
               {/* {this.state.isDialogOpen && (
                   <div>{this.state.query_text}</div>
                )} */}
                {this.state.isDialogOpen && (
                        <div style={{position:'absolute', zIndex:'99999', }}>
                           {this.state.query_text}
                        </div>
                )}
            </div>

            
        );
    }
}

const mapStateToProps = (state) => {
	return {
		allConnections : state.testSuites.connectionsList.allConnections? state.testSuites.connectionsList.allConnections : [],
        currentProject : state.appData.currentProject,
    	};
};
const mapDispatchToProps = dispatch => ({
    getQueryAnalyzerDetails: (data) => dispatch(getQueryAnalyzerDetails(data)),
    getAllConnections:(data) =>dispatch(getAllConnections(data)),
    runQuery:(data) =>dispatch(runQuery(data))
})


export default connect(mapStateToProps, mapDispatchToProps)(QueryAnalyzer);