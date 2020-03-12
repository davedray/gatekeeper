import React from 'react';
import {
    HTMLTable,
} from "@blueprintjs/core";
import TableRow from "../containers/tableRow";
import {Role} from "../../../types";

interface props {
    roles: Role[];
}
function RoleTable({roles}: props) {
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
            {roles.map((role) => (
                <TableRow
                    key={role.id}
                    role={role}
                />
            ))}
            </tbody>
        </HTMLTable>
    );
}

export default RoleTable;
