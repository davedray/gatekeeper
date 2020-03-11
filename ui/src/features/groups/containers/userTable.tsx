import React, {useCallback, useEffect} from 'react';
import Table from '../components/userTable';
import {Group, User} from "../../../types";
import {deleteGroupUser, fetchGroupUsers} from "../../../app/groupUsers/groupUsersSlice";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../app/rootReducer";
import {fetchUsers} from "../../../app/usersList/usersListSlice";
interface props {
    group: Group,
    userIds: string[]
}
function ConnectedUserTable({group, userIds}: props) {
    const dispatch = useDispatch();
    const users = useSelector((state: RootState) => state.usersList.usersByRealmId[group.realmId] || []);
    const selectedRealm = useSelector((state: RootState) => state.realmsList.realmsById[group.realmId]);
    const isLoading = useSelector((state: RootState) => state.usersList.isLoading[group.realmId]);
    useEffect(() => {
        if (users.length === 0 && !isLoading) {
            dispatch(fetchUsers(selectedRealm));
        }
    }, [users.length, selectedRealm, isLoading]);
    const onDelete = useCallback(async (user: User) => {
        dispatch(deleteGroupUser(group, user));
    }, [dispatch, group]);

    return (
        <Table userIds={userIds} onDelete={onDelete}/>
    );
}

export default ConnectedUserTable;
