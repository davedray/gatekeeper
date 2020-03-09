import React from 'react';
import TableRow from '../components/tableRow';
import {useDispatch, useSelector} from 'react-redux'
import {User} from "../../../types";
import {banUser, unbanUser, suspendUser, deleteUser} from "../../../app/usersList/usersListSlice";
import {RootState} from "../../../app/rootReducer";
interface props {
    user: User
}
function ConnectedTableRow({user}: props) {
    const error = useSelector((state: RootState) => state.usersList.error);
    const dispatch = useDispatch();
    const onBan = async () => {
        return dispatch(banUser(user));
    };
    const onUnban = async () => {
        return dispatch(unbanUser(user));
    };
    const onSuspend = async (until: Date) => {
        return dispatch(suspendUser(user, until));
    };
    const onDelete = async() => {
        return dispatch(deleteUser(user));
    }
    return (
        <TableRow user={user} onBan={onBan} onUnban={onUnban} onSuspend={onSuspend} onDelete={onDelete} error={error}/>
    );
}

export default ConnectedTableRow;
