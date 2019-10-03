import React from 'react';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
    toolbarCss:{
        paddingLeft:'2px !important',
       
        "&:hover": {
         
          color:'#ffffff!important'
        }
    
      },
      headerStyles:{
   
        backgroundColor: '#BD4951',
        color: '#ffffff',
        paddingLeft:'22px !important',
        fontFamily: 'Open Sans !important',
        paddingRight:'12px !important',
        fontWeight:'bold',
        marginLeft:'0px',
        width:1080
       
      
       
      },
      newheaderStyles:{
   
        backgroundColor: '#BD4951',
        color: '#ffffff',
        // paddingLeft:'22px !important',
        fontFamily: 'Open Sans !important',
        // paddingRight:'12px !important',
        fontWeight:'bold',
        marginLeft:'0px'
       
      
       
      },
})

function TableHeader(props) {
    const { headers, orderBy, order, handleSort, actionLabel,classes } = props;
    return(
        <TableHead >
            <TableRow >
                {headers.map(header => (
                    <TableCell
                        key={header.id}
                        align='left'
                    
                        sortDirection={orderBy === header.id ? order : false}
                        className={classes.headerStyles}
                    >
                        <TableSortLabel
                            direction={order}
                            onClick={() => handleSort(header.id)}
                            align ='left'
                            className={classes.toolbarCss}
                        >
                    
                        {header.label}
                        </TableSortLabel>
                    </TableCell>
                ))}
                    <TableCell 
                    align ='left'
                   
                     className={classes.newheaderStyles}
                 >
                        {actionLabel}
                    </TableCell>
            </TableRow>
        </TableHead>
    )
}
export default withStyles(styles)(TableHeader);
