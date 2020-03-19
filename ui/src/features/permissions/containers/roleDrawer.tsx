import React, {useCallback, useEffect} from 'react';
import {Permission, Role} from "../../../types";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../app/rootReducer";
import {fetchPermissionRoles, createRolePermission, deleteRolePermission} from "../../../app/rolePermissions/rolePermissionsSlice";
import RoleDrawer from '../../roles/components/roleDrawer';
import {fetchRoles} from "../../../app/rolesList/rolesListSlice";
interface props {
    isOpen: boolean;
    onClose: () => any;
    permission: Permission;
    title: string;
}
function ConnectedRoleDrawer({isOpen, onClose, title, permission}: props) {
    const dispatch = useDispatch();
    const realmId = useSelector((state: RootState) => state.realmsList.selectedRealmId || '');
    const realm = useSelector((state: RootState) => state.realmsList.realmsById[realmId]);
    const roleIds = useSelector((state: RootState) => state.rolePermissions.permissionRoles[permission.id] || []);
    const roles = useSelector((state: RootState) => roleIds.map((id) => state.rolesList.rolesById[id]).filter(i => i));
    const isLoading = useSelector((state: RootState) => state.rolePermissions.isLoadingRoles[permission.id] || false);
    const isLoadingRoles = useSelector((state: RootState) => state.rolesList.isLoading[realmId] || false);
    const hasRoleIds = useSelector((state: RootState) => state.rolePermissions.hasPermissionRoles[permission.id] || false);
    const hasRoles = useSelector((state: RootState) => state.rolesList.isLoaded[realmId]);
    useEffect(() => {
        if (!hasRoleIds && !isLoading && isOpen) {
            dispatch(fetchPermissionRoles(permission));
        }
        if (!hasRoles && !isLoadingRoles && typeof realm !== 'undefined' && isOpen) {
            dispatch(fetchRoles(realm));
        }
    }, [dispatch, permission, hasRoles, hasRoleIds, isLoadingRoles, realm, isOpen, isLoading]);

    const onAddRole = useCallback(async (role: Role) => {
        return dispatch(createRolePermission(role, permission));
    }, [dispatch, permission]);
    const onDeleteRole = useCallback(async (role: Role) => {
        return dispatch(deleteRolePermission(role, permission));
    }, [dispatch, permission]);
    return (
        <RoleDrawer
            isLoading={isLoading || isLoadingRoles}
            isOpen={isOpen}
            onAddRole={onAddRole}
            onDeleteRole={onDeleteRole}
            selectedRoleIds={roleIds}
            onClose={onClose}
            roles={roles}
            emptyStateDescription={'Add a role to this permission to populate this list.'}
            title={`${permission.name} Roles`}
        />
    );
}

export default ConnectedRoleDrawer;
