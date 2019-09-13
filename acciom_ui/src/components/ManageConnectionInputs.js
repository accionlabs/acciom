import React from 'react';
import { Panel, Button, Table } from 'react-bootstrap';

export default function ManageConnectionInputs(props) {
	console.log('FormControlLabelPosition ', props);

	return (
		<Table className="manageConnection">
			<tbody>
				<tr>
					<td className="manageConnectionLabel panelheadborder"><label className="manageConnectionHeading sub_title selectconnectiontype">Select Connection Type</label></td>
					<td>
						<div >
							<label className="form-check-label radiolabel">
								<input
									type="radio"
									value="source"
									checked={props.selectedConnectionType === "source"}
									name="connectionType"
									onChange={ (e) => props.onChange(event.target.value)}
								/>
							</label>&nbsp; Source &nbsp;
							<label className="form-check-label radiolabel">
								<input
									type="radio"
									value="target"
									checked={props.selectedConnectionType === "target"}
									name="connectionType"
									onChange={ (e) => props.onChange(event.target.value)}
								/>
							</label>&nbsp; Target
						</div>
					</td>
				</tr>
			</tbody>
		</Table>
	);
}