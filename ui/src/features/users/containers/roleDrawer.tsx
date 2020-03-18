import React, {useCallback, useEffect} from 'react';
import {User, Role} from "../../../types";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../app/rootReducer";
import {fetchUserRoles, createRoleUser, deleteRoleUser} from "../../../app/roleUsers/roleUsersSlice";
import RoleDrawer from '../../roles/components/roleDrawer';
import {fetchRoles} from "../../../app/rolesList/rolesListSlice";
interface props {
    isOpen: boolean;
    onClose: () => any;
    user: User;
    title: string;
}
function ConnectedRoleDrawer({isOpen, onClose, title, user}: props) {
    const dispatch = useDispatch();
    const selectedRealm = useSelector((state: RootState) => state.realmsList.realmsById[state.realmsList.selectedRealmId || '']);
    const roleIds = useSelector((state: RootState) => state.roleUsers.userRoles[user.id] || []);
    const roles = useSelector((state: RootState) => roleIds.map((id) => state.rolesList.rolesById[id]).filter(i => i));
    const isLoadingUserRoles = useSelector((state: RootState) => state.roleUsers.isLoadingRoles[user.id] || false);
    const isLoadingRoles = useSelector((state: RootState) => state.rolesList.isLoading[state.realmsList.selectedRealmId || ''] || false);
    const hasRoleUsers = useSelector((state: RootState) => state.roleUsers.hasUserRoles[user.id] || false);
    const hasRoles = useSelector((state: RootState) => state.rolesList.isLoaded[state.realmsList.selectedRealmId || ''] || false);
    useEffect(() => {
        if (!hasRoleUsers && !isLoadingUserRoles && isOpen) {
            dispatch(fetchUserRoles(user));
        }
    }, [dispatch, user, hasRoleUsers, isLoadingUserRoles, isOpen]);
    useEffect(() => {
        if (!hasRoles && !isLoadingRoles && isOpen) {
            dispatch(fetchRoles(selectedRealm));
        }
    }, [dispatch, user, hasRoles, isLoadingRoles, selectedRealm, isOpen]);
    const onAddRole = useCallback(async (role: Role) => {
        return dispatch(createRoleUser(role, user));
    }, [dispatch, user]);
    const onDeleteRole = useCallback(async (role: Role) => {
        return dispatch(deleteRoleUser(role, user));
    }, [dispatch, user]);
    return (
        <RoleDrawer
            isLoading={isLoadingUserRoles || isLoadingRoles}
            isOpen={isOpen}
            onAddRole={onAddRole}
            onDeleteRole={onDeleteRole}
            selectedRoleIds={roleIds}
            onClose={onClose}
            roles={roles}
            title={`${user.username} Roles`}
            emptyStateDescription="Add a role to this user to populate this list"
        />
    );
}

export default ConnectedRoleDrawer;
