import React from 'react';
import TableRow from '../components/userTableRow';
import {useSelector} from 'react-redux'
import {User} from "../../../types";
import {RootState} from "../../../app/rootReducer";
interface props {
    userId: string,
    onDelete: (user: User) => Promise<any>
}
function ConnectedUserTableRow({ userId, onDelete}: props) {
    const error = useSelector((state: RootState) => state.groupUsers.error);
    const user = useSelector((state: RootState) => state.usersList.usersById[userId]);
    const deleteGroupUser = async () => {
        await onDelete(user);
    };
    return (
        <TableRow user={user} onDelete={deleteGroupUser} error={error}/>
    );
}

export default ConnectedUserTableRow;
