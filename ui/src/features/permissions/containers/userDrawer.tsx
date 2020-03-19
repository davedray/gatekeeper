import React, {useCallback, useEffect} from 'react';
import {Permission, User} from "../../../types";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../app/rootReducer";
import {fetchPermissionUsers, createUserPermission, deleteUserPermission} from "../../../app/userPermissions/userPermissionsSlice";
import UserDrawer from '../../users/components/userDrawer';
import {fetchUsers} from "../../../app/usersList/usersListSlice";
interface props {
    isOpen: boolean;
    onClose: () => any;
    permission: Permission;
    title: string;
}
function ConnectedUserDrawer({isOpen, onClose, title, permission}: props) {
    const dispatch = useDispatch();
    const realm = useSelector((state: RootState) => state.realmsList.realmsById[state.realmsList.selectedRealmId || '']);
    const userIds = useSelector((state: RootState) => state.userPermissions.permissionUsers[permission.id] || []);
    const users = useSelector((state: RootState) => userIds.map((id) => state.usersList.usersById[id]).filter(i => i));
    const isLoadingUsers = useSelector((state: RootState) => !!state.usersList.isLoading[state.realmsList.selectedRealmId || '']);
    const isLoading = useSelector((state: RootState) => state.userPermissions.isLoadingUsers[permission.id] || false);
    const hasPermissionUsers = useSelector((state: RootState) => state.userPermissions.hasPermissionUsers[permission.id] || false);
    const hasUsers = useSelector((state: RootState) => !!state.usersList.isLoaded[state.realmsList.selectedRealmId || '']);
    useEffect(() => {
        if (!hasPermissionUsers && !isLoading && isOpen) {
            dispatch(fetchPermissionUsers(permission));
        }
        if (realm && !hasUsers && !isLoadingUsers && isOpen) {
            dispatch(fetchUsers(realm));
        }
    }, [dispatch, permission, hasUsers, hasPermissionUsers, isOpen, realm, isLoading, isLoadingUsers]);
    const onAddUser = useCallback(async (user: User) => {
        return dispatch(createUserPermission(user, permission));
    }, [dispatch, permission]);
    const onDeleteUser = useCallback(async (user: User) => {
        return dispatch(deleteUserPermission(user, permission));
    }, [dispatch, permission]);
    return (
        <UserDrawer
            isLoading={isLoading || isLoadingUsers}
            isOpen={isOpen}
            onAddUser={onAddUser}
            onDeleteUser={onDeleteUser}
            selectedUserIds={userIds}
            onClose={onClose}
            users={users}
            emptyStateDescription={'Add a user to this permission to populate this list.'}
            title={`${permission.name} Users`}
        />
    );
}

export default ConnectedUserDrawer;
