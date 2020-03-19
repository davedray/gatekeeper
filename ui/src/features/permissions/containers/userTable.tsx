import React, {useCallback, useEffect} from 'react';
import Table from '../components/userTable';
import {Permission, User} from "../../../types";
import {deleteUserPermission, fetchPermissionUsers} from "../../../app/userPermissions/userPermissionsSlice";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../app/rootReducer";
import {fetchUsers} from "../../../app/usersList/usersListSlice";
interface props {
    permission: Permission,
    userIds: string[]
}
function ConnectedUserTable({permission, userIds}: props) {
    const dispatch = useDispatch();
    const users = useSelector((state: RootState) => state.usersList.usersByRealmId[permission.realmId] || []);
    const selectedRealm = useSelector((state: RootState) => state.realmsList.realmsById[permission.realmId]);
    const isLoading = useSelector((state: RootState) => state.usersList.isLoading[permission.realmId]);
    useEffect(() => {
        if (users.length === 0 && !isLoading) {
            dispatch(fetchUsers(selectedRealm));
        }
    }, [users.length, selectedRealm, isLoading]);
    const onDelete = useCallback(async (user: User) => {
        dispatch(deleteUserPermission(user, permission));
    }, [dispatch, permission]);

    return (
        <Table userIds={userIds} onDelete={onDelete}/>
    );
}

export default ConnectedUserTable;
