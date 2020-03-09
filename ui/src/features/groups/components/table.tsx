import React from 'react';
import {
    HTMLTable,
} from "@blueprintjs/core";
import TableRow from "../containers/tableRow";
import {Group} from "../../../types";

interface props {
    groups: Group[];
}
function GroupTable({groups}: props) {
    return (
        <HTMLTable
            bordered
            style={{width: '100%'}}
        >
            <thead>
            <tr>
                <th>Name</th>
                <th>Actions</th>
            </tr>
            </thead>
            <tbody>
            {groups.map((group) => (
                <TableRow
                    key={group.id}
                    group={group}
                />
            ))}
            </tbody>
        </HTMLTable>
    );
}

export default GroupTable;
