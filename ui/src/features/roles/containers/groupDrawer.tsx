import React, {useCallback, useEffect} from 'react';
import {Role, Group} from "../../../types";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../app/rootReducer";
import {fetchRoleGroups, createRoleGroup, deleteRoleGroup} from "../../../app/roleGroups/roleGroupsSlice";
import GroupDrawer from '../../groups/components/groupDrawer';
interface props {
    isOpen: boolean;
    onClose: () => any;
    role: Role;
    title: string;
}
function ConnectedGroupDrawer({isOpen, onClose, title, role}: props) {
    const dispatch = useDispatch();
    const groupIds = useSelector((state: RootState) => state.roleGroups.roleGroups[role.id] || []);
    const groups = useSelector((state: RootState) => groupIds.map((id) => state.groupsList.groupsById[id]));
    const isLoading = useSelector((state: RootState) => state.roleGroups.isLoadingGroups[role.id] || false);
    const hasGroups = groupIds.length;
    useEffect(() => {
        if (!hasGroups && isOpen) {
            dispatch(fetchRoleGroups(role));
        }
    }, [dispatch, role, hasGroups, isOpen]);
    const onAddGroup = useCallback(async (group: Group) => {
        return dispatch(createRoleGroup(role, group));
    }, [dispatch, role]);
    const onDeleteGroup = useCallback(async (group: Group) => {
        return dispatch(deleteRoleGroup(role, group));
    }, [dispatch, role]);
    return (
        <GroupDrawer
            isLoading={isLoading}
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
