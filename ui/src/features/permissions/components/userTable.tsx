import React from 'react';
import {
    HTMLTable,
} from "@blueprintjs/core";
import TableRow from "../containers/userTableRow";
import {User} from "../../../types";

interface props {
    userIds: string[],
    className?: string,
    onDelete: (user: User) => Promise<any>;
}
function UserTable({userIds, className, onDelete}: props) {
    return (
        <HTMLTable
            className={className}
            bordered
            style={{width: '100%'}}
        >
            <thead>
            <tr>
                <th>Username</th>
                <th>Actions</th>
            </tr>
            </thead>
            <tbody>
            {userIds.map((id) => (
                <TableRow
                    key={id}
                    userId={id}
                    onDelete={onDelete}
                />
            ))}
            </tbody>
        </HTMLTable>
    );
}

export default UserTable;
