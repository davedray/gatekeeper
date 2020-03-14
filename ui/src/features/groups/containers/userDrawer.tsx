import React, {useCallback, useEffect} from 'react';
import {Group, User} from "../../../types";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../app/rootReducer";
import {fetchGroupUsers, createGroupUser, deleteGroupUser} from "../../../app/groupUsers/groupUsersSlice";
import UserDrawer from '../../users/components/userDrawer';
interface props {
    isOpen: boolean;
    onClose: () => any;
    group: Group;
    title: string;
}
function ConnectedUserDrawer({isOpen, onClose, title, group}: props) {
    const dispatch = useDispatch();
    const userIds = useSelector((state: RootState) => state.groupUsers.groupUsers[group.id] || []);
    const users = useSelector((state: RootState) => userIds.map((id) => state.usersList.usersById[id]));
    const isLoading = useSelector((state: RootState) => state.groupUsers.isLoading[group.id] || false);
    const hasUsers = userIds.length;
    useEffect(() => {
        if (!hasUsers && isOpen) {
            dispatch(fetchGroupUsers(group));
        }
    }, [dispatch, group, hasUsers, isOpen]);
    const onAddUser = useCallback(async (user: User) => {
        return dispatch(createGroupUser(group, user));
    }, [dispatch, group]);
    const onDeleteUser = useCallback(async (user: User) => {
        return dispatch(deleteGroupUser(group, user));
    }, [dispatch, group]);
    return (
        <UserDrawer
            isLoading={isLoading}
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
