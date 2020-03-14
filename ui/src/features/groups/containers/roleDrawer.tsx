import React, {useCallback, useEffect} from 'react';
import {Group, Role} from "../../../types";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../app/rootReducer";
import {fetchGroupRoles, createRoleGroup, deleteRoleGroup} from "../../../app/roleGroups/roleGroupsSlice";
import RoleDrawer from '../../roles/components/roleDrawer';
import {fetchRoles} from "../../../app/rolesList/rolesListSlice";
interface props {
    isOpen: boolean;
    onClose: () => any;
    group: Group;
    title: string;
}
function ConnectedRoleDrawer({isOpen, onClose, title, group}: props) {
    const dispatch = useDispatch();
    const realmId = useSelector((state: RootState) => state.realmsList.selectedRealmId || '');
    const realm = useSelector((state: RootState) => state.realmsList.realmsById[realmId]);
    const roleIds = useSelector((state: RootState) => state.roleGroups.groupRoles[group.id] || []);
    const roles = useSelector((state: RootState) => roleIds.map((id) => state.rolesList.rolesById[id]).filter(i => i));
    const isLoading = useSelector((state: RootState) => state.roleGroups.isLoadingRoles[group.id] || false);
    const isLoadingRoles = useSelector((state: RootState) => state.rolesList.isLoading[realmId] || false);
    const hasRoleIds = useSelector((state: RootState) => state.roleGroups.hasGroupRoles[group.id] || false);
    const hasRoles = useSelector((state: RootState) => state.rolesList.isLoaded[realmId]);
    useEffect(() => {
        if (!hasRoleIds && !isLoading && isOpen) {
            dispatch(fetchGroupRoles(group));
        }
        if (!hasRoles && !isLoadingRoles && typeof realm !== 'undefined' && isOpen) {
            dispatch(fetchRoles(realm));
        }
    }, [dispatch, group, hasRoles, hasRoleIds, isLoadingRoles, realm, isOpen, isLoading]);

    const onAddRole = useCallback(async (role: Role) => {
        return dispatch(createRoleGroup(role, group));
    }, [dispatch, group]);
    const onDeleteRole = useCallback(async (role: Role) => {
        return dispatch(deleteRoleGroup(role, group));
    }, [dispatch, group]);
    return (
        <RoleDrawer
            isLoading={isLoading || isLoadingRoles}
            isOpen={isOpen}
            onAddRole={onAddRole}
            onDeleteRole={onDeleteRole}
            selectedRoleIds={roleIds}
            onClose={onClose}
            roles={roles}
            emptyStateDescription={'Add a role to this group to populate this list.'}
            title={`${group.name} Roles`}
        />
    );
}

export default ConnectedRoleDrawer;
