import React, {useCallback, useEffect} from 'react';
import {Role, User} from "../../../types";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../app/rootReducer";
import {fetchRoleUsers, createRoleUser, deleteRoleUser} from "../../../app/roleUsers/roleUsersSlice";
import UserDrawer from '../../users/components/userDrawer';
interface props {
    isOpen: boolean;
    onClose: () => any;
    role: Role;
    title: string;
}
function ConnectedUserDrawer({isOpen, onClose, title, role}: props) {
    const dispatch = useDispatch();
    const userIds = useSelector((state: RootState) => state.roleUsers.roleUsers[role.id] || []);
    const users = useSelector((state: RootState) => userIds.map((id) => state.usersList.usersById[id]));
    const isLoading = useSelector((state: RootState) => state.roleUsers.isLoading[role.id] || false);
    const hasUsers = userIds.length;
    useEffect(() => {
        if (!hasUsers && isOpen) {
            dispatch(fetchRoleUsers(role));
        }
    }, [dispatch, role, hasUsers, isOpen]);
    const onAddUser = useCallback(async (user: User) => {
        return dispatch(createRoleUser(role, user));
    }, [dispatch, role]);
    const onDeleteUser = useCallback(async (user: User) => {
        return dispatch(deleteRoleUser(role, user));
    }, [dispatch, role]);
    return (
        <UserDrawer
            isLoading={isLoading}
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
