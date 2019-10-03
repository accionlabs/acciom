import React from 'react';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';


function TableHeader(props) {
    const { headers, orderBy, order, handleSort, actionLabel } = props;
    return(
        <TableHead >
            <TableRow >
                {headers.map(header => (
                    <TableCell
                        key={header.id}
                        align='left'
                    
                        sortDirection={orderBy === header.id ? order : false}
                    >
                        <TableSortLabel
                            direction={order}
                            onClick={() => handleSort(header.id)}
                            align ='left'
                        >
                    
                        {header.label}
                        </TableSortLabel>
                    </TableCell>
                ))}
                    <TableCell align='right'>
                        {actionLabel}
                    </TableCell>
            </TableRow>
        </TableHead>
    )
}

export default TableHeader;