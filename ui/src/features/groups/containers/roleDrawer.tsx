import React, {useCallback, useEffect} from 'react';
import {Group, Role} from "../../../types";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../app/rootReducer";
import {fetchGroupRoles, createRoleGroup, deleteRoleGroup} from "../../../app/roleGroups/roleGroupsSlice";
import RoleDrawer from '../../roles/components/roleDrawer';
interface props {
    isOpen: boolean;
    onClose: () => any;
    group: Group;
    title: string;
}
function ConnectedRoleDrawer({isOpen, onClose, title, group}: props) {
    const dispatch = useDispatch();
    const roleIds = useSelector((state: RootState) => state.roleGroups.groupRoles[group.id] || []);
    const roles = useSelector((state: RootState) => roleIds.map((id) => state.rolesList.rolesById[id]));
    const isLoading = useSelector((state: RootState) => state.roleGroups.isLoadingRoles[group.id] || false);
    const hasRoles = roleIds.length;
    useEffect(() => {
        if (!hasRoles && isOpen) {
            dispatch(fetchGroupRoles(group));
        }
    }, [dispatch, group, hasRoles, isOpen]);
    const onAddRole = useCallback(async (role: Role) => {
        return dispatch(createRoleGroup(role, group));
    }, [dispatch, group]);
    const onDeleteRole = useCallback(async (role: Role) => {
        return dispatch(deleteRoleGroup(role, group));
    }, [dispatch, group]);
    return (
        <RoleDrawer
            isLoading={isLoading}
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
