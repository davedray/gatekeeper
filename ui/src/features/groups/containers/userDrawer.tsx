import React, {useCallback, useEffect} from 'react';
import {Group, User} from "../../../types";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../app/rootReducer";
import {fetchGroupUsers, createUserGroup, deleteUserGroup} from "../../../app/groupUsers/groupUsersSlice";
import UserDrawer from '../../users/components/userDrawer';
import {fetchUsers} from "../../../app/usersList/usersListSlice";
interface props {
    isOpen: boolean;
    onClose: () => any;
    group: Group;
    title: string;
}
function ConnectedUserDrawer({isOpen, onClose, title, group}: props) {
    const dispatch = useDispatch();
    const realm = useSelector((state: RootState) => state.realmsList.realmsById[state.realmsList.selectedRealmId || '']);
    const userIds = useSelector((state: RootState) => state.groupUsers.groupUsers[group.id] || []);
    const users = useSelector((state: RootState) => userIds.map((id) => state.usersList.usersById[id]).filter(i => i));
    const isLoadingUsers = useSelector((state: RootState) => !!state.usersList.isLoading[state.realmsList.selectedRealmId || '']);
    const isLoading = useSelector((state: RootState) => state.groupUsers.isLoadingUsers[group.id] || false);
    const hasGroupUsers = useSelector((state: RootState) => state.groupUsers.hasGroupUsers[group.id] || false);
    const hasUsers = useSelector((state: RootState) => !!state.usersList.isLoaded[state.realmsList.selectedRealmId || '']);
    useEffect(() => {
        if (!hasGroupUsers && !isLoading && isOpen) {
            dispatch(fetchGroupUsers(group));
        }
        if (realm && !hasUsers && !isLoadingUsers && isOpen) {
            dispatch(fetchUsers(realm));
        }
    }, [dispatch, group, hasUsers, hasGroupUsers, isOpen, realm, isLoading, isLoadingUsers]);
    const onAddUser = useCallback(async (user: User) => {
        return dispatch(createUserGroup(user, group));
    }, [dispatch, group]);
    const onDeleteUser = useCallback(async (user: User) => {
        return dispatch(deleteUserGroup(user, group));
    }, [dispatch, group]);
    return (
        <UserDrawer
            isLoading={isLoading || isLoadingUsers}
            isOpen={isOpen}
            onAddUser={onAddUser}
            onDeleteUser={onDeleteUser}
            selectedUserIds={userIds}
            onClose={onClose}
            users={users}
            emptyStateDescription={'Add a user to this group to populate this list.'}
            title={`${group.name} Users`}
        />
    );
}

export default ConnectedUserDrawer;
