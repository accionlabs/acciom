import React from 'react';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TableBody from '@material-ui/core/TableBody';
import { classes } from 'istanbul-lib-coverage';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
    tableRowStyling:{
        fontFamily: 'Open Sans !important',
        paddingLeft:'22px !important',
        fontWeight:400,
        height:'10%'
      },
      tableHover:{
        "&:hover": {
         
          color:'#eff4fc!important'
        }
    
      },

})

function TableListBody(props) {
    const {page, rowsPerPage, orderBy, order, search, bodyData, headers, stableSort, getSorting, searchingFor,classes } = props;
    return(
        <TableBody  className="table_body">
           
            {bodyData.length > 0 &&
            stableSort(bodyData, getSorting(order, orderBy))
            .filter(searchingFor(search,headers))
            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            .map((item,index) => (
                <TableRow  tabIndex={-1} key={index}
                className ={classes.tableHover}>
                    { headers.map(header => (
                        <TableCell key={`${header.id}-${index}`}
                       className={classes.tableRowStyling} >
                            {item[header.id]}
                        </TableCell>
                    ))}
                    <TableCell align="right" padding="checkbox">
                        {item.action}
                    </TableCell>
                </TableRow>
            ))
            }
        </TableBody>
    )
}
export default withStyles(styles)(TableListBody);
