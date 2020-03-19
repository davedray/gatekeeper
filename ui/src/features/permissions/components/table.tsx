import React from 'react';
import {
    HTMLTable,
} from "@blueprintjs/core";
import TableRow from "../containers/tableRow";
import {Permission} from "../../../types";

interface props {
    permissions: Permission[];
}
function PermissionTable({permissions}: props) {
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
            {permissions.map((permission) => (
                <TableRow
                    key={permission.id}
                    permission={permission}
                />
            ))}
            </tbody>
        </HTMLTable>
    );
}

export default PermissionTable;
