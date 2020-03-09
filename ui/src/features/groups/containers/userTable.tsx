import React from 'react';
import Table from '../components/userTable';
import {Group, User} from "../../../types";
import {deleteGroupUser} from "../../../app/groupUsers/groupUsersSlice";
import {useDispatch} from "react-redux";
interface props {
    group: Group,
    userIds: string[]
}
function ConnectedUserTable({group, userIds}: props) {
    const dispatch = useDispatch();
    const onDelete = async (user: User) => {
        dispatch(deleteGroupUser(group, user));
    };

    return (
        <Table userIds={userIds} onDelete={onDelete}/>
    );
}

export default ConnectedUserTable;
