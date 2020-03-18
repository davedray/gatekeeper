import React, {useCallback, useEffect} from 'react';
import {Role, User} from "../../../types";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../app/rootReducer";
import {fetchRoleUsers, createRoleUser, deleteRoleUser} from "../../../app/roleUsers/roleUsersSlice";
import UserDrawer from '../../users/components/userDrawer';
import {fetchUsers} from "../../../app/usersList/usersListSlice";
interface props {
    isOpen: boolean;
    onClose: () => any;
    role: Role;
    title: string;
}
function ConnectedUserDrawer({isOpen, onClose, title, role}: props) {
    const dispatch = useDispatch();
    const selectedRealm = useSelector((state: RootState) => state.realmsList.realmsById[state.realmsList.selectedRealmId || '']);
    const userIds = useSelector((state: RootState) => state.roleUsers.roleUsers[role.id] || []);
    const users = useSelector((state: RootState) => userIds.map((id) => state.usersList.usersById[id]).filter(i => i));
    const isLoadingUserIds = useSelector((state: RootState) => state.roleUsers.isLoadingUsers[role.id] || false);
    const hasUsers = useSelector((state: RootState) => state.usersList.isLoaded[selectedRealm ? selectedRealm.id : ''] || false);
    const isLoadingUsers = useSelector((state: RootState) => state.usersList.isLoading[selectedRealm ? selectedRealm.id : ''] || false);
    const hasUserIds = useSelector((state: RootState) => state.roleUsers.hasRoleUsers[role.id] || false);

    useEffect(() => {
        if (!hasUserIds && !isLoadingUserIds && isOpen) {
            dispatch(fetchRoleUsers(role));
        }
    }, [dispatch, role, isLoadingUserIds, hasUserIds, isOpen]);
    useEffect(() => {
        if (!hasUsers && !isLoadingUsers && isOpen) {
            dispatch(fetchUsers(selectedRealm));
        }
    }, [dispatch, role, isLoadingUsers, hasUsers, selectedRealm, isOpen]);
    const onAddUser = useCallback(async (user: User) => {
        return dispatch(createRoleUser(role, user));
    }, [dispatch, role]);
    const onDeleteUser = useCallback(async (user: User) => {
        return dispatch(deleteRoleUser(role, user));
    }, [dispatch, role]);
    return (
        <UserDrawer
            isLoading={isLoadingUsers || isLoadingUserIds}
            isOpen={isOpen}
            onAddUser={onAddUser}
            onDeleteUser={onDeleteUser}
            selectedUserIds={userIds}
            onClose={onClose}
            users={users}
            title={`${role.name} Users`}
            emptyStateDescription="Add a user to this role to populate this list"
        />
    );
}

export default ConnectedUserDrawer;
