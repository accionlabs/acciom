import React from 'react';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TableBody from '@material-ui/core/TableBody';


function TableListBody(props) {
    const {page, rowsPerPage, orderBy, order, search, bodyData, headers, stableSort, getSorting, searchingFor } = props;
    return(
        <TableBody className="commonTableBody">
            {bodyData.length > 0 &&
            stableSort(bodyData, getSorting(order, orderBy))
            .filter(searchingFor(search,headers))
            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            .map((item,index) => (
                <TableRow hover tabIndex={-1} key={index}>
                    { headers.map(header => (
                        <TableCell className="commonTableCellTextColor" key={`${header.id}-${index}`}>
                            {item[header.id]}
                        </TableCell>
                    ))}
                    <TableCell align="right" padding="checkbox" className="commonTableCellBorder">
                        {item.action}
                    </TableCell>
                </TableRow>
            ))
            }
        </TableBody>
    )
}

export default TableListBody;