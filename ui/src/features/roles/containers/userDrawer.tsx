import React, {useCallback, useEffect} from 'react';
import {Role, User} from "../../../types";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../app/rootReducer";
import {fetchRoleUsers, createRoleUser} from "../../../app/roleUsers/roleUsersSlice";
import UserDrawer from '../components/userDrawer';
interface props {
    isOpen: boolean;
    onClose: () => any;
    role: Role;
    title: string;
}
function ConnectedUserDrawer({isOpen, onClose, title, role}: props) {
    const dispatch = useDispatch();
    const userIds = useSelector((state: RootState) => state.roleUsers.roleUsers[role.id] || []);
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
    return (
        <UserDrawer
            isLoading={isLoading}
            isOpen={isOpen}
            onClose={onClose}
            title={title}
            role={role}
            userIds={userIds}
            onAddUser={onAddUser}
        />
    );
}

export default ConnectedUserDrawer;
