import React, {useCallback, useEffect} from 'react';
import {Role, Group} from "../../../types";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../app/rootReducer";
import {fetchRoleGroups, createRoleGroup, deleteRoleGroup} from "../../../app/roleGroups/roleGroupsSlice";
import GroupDrawer from '../../groups/components/groupDrawer';
import {fetchGroups} from "../../../app/groupsList/groupsListSlice";
interface props {
    isOpen: boolean;
    onClose: () => any;
    role: Role;
    title: string;
}
function ConnectedGroupDrawer({isOpen, onClose, title, role}: props) {
    const dispatch = useDispatch();
    const selectedRealm = useSelector((state: RootState) => state.realmsList.realmsById[state.realmsList.selectedRealmId || '']);
    const groupIds = useSelector((state: RootState) => state.roleGroups.roleGroups[role.id] || []);
    const groups = useSelector((state: RootState) => groupIds.map((id) => state.groupsList.groupsById[id]).filter(i => i));
    const isLoadingGroupIds = useSelector((state: RootState) => state.roleGroups.isLoadingGroups[role.id] || false);
    const isLoadingGroups = useSelector((state: RootState) => state.groupsList.isLoading[selectedRealm ? selectedRealm.id : ''] || false);
    const hasGroupIds = useSelector((state: RootState) => state.roleGroups.hasRoleGroups[role.id] || false);
    const hasGroups = useSelector((state: RootState) => state.groupsList.isLoaded[selectedRealm ? selectedRealm.id : ''] || false);

    useEffect(() => {
        if (!hasGroupIds && !isLoadingGroupIds && isOpen) {
            dispatch(fetchRoleGroups(role));
        }
    }, [dispatch, role, hasGroupIds, isLoadingGroupIds, isOpen]);
    useEffect(() => {
        if (!hasGroups && !isLoadingGroups && isOpen) {
            dispatch(fetchGroups(selectedRealm));
        }
    }, [dispatch, role, hasGroups, isLoadingGroups, isOpen, selectedRealm]);
    const onAddGroup = useCallback(async (group: Group) => {
        return dispatch(createRoleGroup(role, group));
    }, [dispatch, role]);
    const onDeleteGroup = useCallback(async (group: Group) => {
        return dispatch(deleteRoleGroup(role, group));
    }, [dispatch, role]);
    return (
        <GroupDrawer
            isLoading={isLoadingGroups || isLoadingGroupIds}
            isOpen={isOpen}
            onAddGroup={onAddGroup}
            onDeleteGroup={onDeleteGroup}
            selectedGroupIds={groupIds}
            onClose={onClose}
            groups={groups}
            title={`${role.name} Groups`}
            emptyStateDescription="Add a group to this role to populate this list"
        />
    );
}

export default ConnectedGroupDrawer;
