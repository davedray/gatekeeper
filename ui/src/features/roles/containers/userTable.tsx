import React, {useCallback, useEffect} from 'react';
import Table from '../../users/components/userTable';
import {Role, User} from "../../../types";
import {deleteRoleUser, fetchRoleUsers} from "../../../app/roleUsers/roleUsersSlice";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../app/rootReducer";
import {fetchUsers} from "../../../app/usersList/usersListSlice";
interface props {
    role: Role,
    userIds: string[]
}
function ConnectedUserTable({role, userIds}: props) {
    const dispatch = useDispatch();
    const users = useSelector((state: RootState) => state.usersList.usersByRealmId[role.realmId] || []);
    const selectedRealm = useSelector((state: RootState) => state.realmsList.realmsById[role.realmId]);
    const isLoading = useSelector((state: RootState) => state.usersList.isLoading[role.realmId]);
    useEffect(() => {
        if (users.length === 0 && !isLoading) {
            dispatch(fetchUsers(selectedRealm));
        }
    }, [users.length, selectedRealm, isLoading]);
    const onDelete = useCallback(async (user: User) => {
        dispatch(deleteRoleUser(role, user));
    }, [dispatch, role]);

    return (
        <Table userIds={userIds} onDelete={onDelete}/>
    );
}

export default ConnectedUserTable;
