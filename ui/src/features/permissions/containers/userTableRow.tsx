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
    const error = useSelector((state: RootState) => state.userPermissions.error);
    const user = useSelector((state: RootState) => state.usersList.usersById[userId]);
    const loading = useSelector((state: RootState) => state.usersList.isLoading[state.realmsList.selectedRealmId || '']);
    const deletePermissionUser = async () => {
        await onDelete(user);
    };
    return loading ? <tr><td className={'bp3-skeleton'} colSpan={1000}>Loading</td></tr> : (
        <TableRow user={user} onDelete={deletePermissionUser} error={error}/>
    );
}

export default ConnectedUserTableRow;
