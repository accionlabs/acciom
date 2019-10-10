import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Paper from '@material-ui/core/Paper';
import Tooltip from '@material-ui/core/Tooltip';
import { classes } from 'istanbul-lib-coverage';

class ProjectTableHead extends React.Component {

    createSortHandler = property => event => {
  
      if(property ==='Action'){
        return;
      }
  this.props.onRequestSort(event, property);
    };

    displayTableHead=(headerValue)=>{
      
      const {  order, orderBy, rowCount,headers,headerCss } = this.props;
      let headerData =[];
      headerData=headerValue.map(
        (row) => (
          <TableCell
            key={row.id}
         
            className="commonTableData"
            align={row.label ==='Action'?'right':'left'}
         
        
            sortDirection={orderBy === row.id ? order : false}
          >
        
        <Tooltip
              title={row.label}
              placement={row.id ? 'bottom-end' : 'bottom-start'}
              enterDelay={300}
            >
              <TableSortLabel
              className="commonTableHovercolor"
                direction={order}
                onClick={this.createSortHandler(row.id)}
                hideSortIcon={row.label ==='Action'}
                
             
              >
         
             {row.label}
              </TableSortLabel>
            </Tooltip>
            
          </TableCell>
        ),
        this,
      )
      return headerData;

    }
  

 


  
    render() {

      return (
       <Fragment>
      
        <TableHead  className ="commonTableHead" >
          <TableRow className ="commonTableLineheight" >
        
         {this.displayTableHead(this.props.headers)}
           
          </TableRow>
        </TableHead>
       </Fragment>
      
         
      );
    }
  }
  ProjectTableHead.propTypes = {
 
    onRequestSort: PropTypes.func.isRequired,
   
    order: PropTypes.string.isRequired,
    orderBy: PropTypes.string.isRequired,
    rowCount: PropTypes.number.isRequired,
  };

  export default(ProjectTableHead);
