import React from 'react';
import {
    HTMLTable,
} from "@blueprintjs/core";
import TableRow from "../containers/tableRow";
import {User} from "../../../types";

interface props {
    users: User[]
}
function UserTable({users}: props) {
    return (
        <HTMLTable
            bordered
            style={{width: '100%'}}
        >
            <thead>
            <tr>
                <th>Username</th>
                <th>Banned</th>
                <th>Suspended Until</th>
                <th>Actions</th>
            </tr>
            </thead>
            <tbody>
            {users.map((user) => (
                <TableRow
                    key={user.id}
                    user={user}
                />
            ))}
            </tbody>
        </HTMLTable>
    );
}

export default UserTable;
