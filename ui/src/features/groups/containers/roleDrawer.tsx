import React, {useEffect, useState} from 'react';
import {Role} from "../../../types";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../app/rootReducer";
import {fetchRoles} from "../../../app/rolesList/rolesListSlice";
import RoleDrawer from '../../roles/components/roleDrawer';
interface props {
    emptyStateDescription?: string;
    isLoading: boolean;
    isOpen: boolean;
    onAddRole: (role: Role) => Promise<any>;
    onDeleteRole: (role: Role) => Promise<any>;
    onOpen: () => any;
    onClose: () => any;
    roleIds: string[];
}
function ConnectedRoleDrawer({
    emptyStateDescription,
    isLoading,
    isOpen,
    onAddRole,
    onClose,
    onDeleteRole,
    onOpen,
    roleIds,
}: props) {
    const dispatch = useDispatch();
    const selectedRealmId = useSelector((state: RootState) => state.realmsList.selectedRealmId);
    const selectedRealm = useSelector((state: RootState) => state.realmsList.realmsById[selectedRealmId || '']);
    const roles = useSelector((state: RootState) => selectedRealmId ? (state.rolesList.rolesByRealmId[selectedRealmId] || []) : []);
    const isLoadingRoles = useSelector((state: RootState) => !!state.rolesList.isLoading[selectedRealmId || '']);
    useEffect(() => {
        if (selectedRealm && isOpen && !isLoadingRoles && !roles.length) {
            dispatch(fetchRoles(selectedRealm));
        }
        if (isOpen && !isLoading && !roleIds.length) {
            onOpen();
        }
    },[selectedRealm, isOpen, isLoadingRoles, roles.length]);
    return (
        <RoleDrawer
            isLoading={isLoadingRoles || isLoading}
            isOpen={isOpen}
            onAddRole={onAddRole}
            onDeleteRole={onDeleteRole}
            selectedRoleIds={roleIds}
            onClose={onClose}
            roles={roles}
            emptyStateDescription={emptyStateDescription}
        />
    );
}

export default ConnectedRoleDrawer;
