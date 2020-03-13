import React, {useCallback, useEffect} from 'react';
import TableRow from '../components/tableRow';
import {useDispatch, useSelector} from 'react-redux'
import {Group, Role, User} from "../../../types";
import {deleteGroup, updateGroup} from "../../../app/groupsList/groupsListSlice";
import {fetchGroupRoles, createRoleGroup, deleteRoleGroup} from "../../../app/roleGroups/roleGroupsSlice";
import {fetchGroupUsers, createGroupUser, deleteGroupUser} from "../../../app/groupUsers/groupUsersSlice";
import {RootState} from "../../../app/rootReducer";
interface props {
    group: Group;
}
function ConnectedTableRow({group}: props) {
    const error = useSelector((state: RootState) => state.groupsList.error);
    const roleIds: string[] = useSelector((state: RootState) => state.roleGroups.groupRoles[group.id] || []);
    const userIds: string[] = useSelector((state: RootState) => state.groupUsers.groupUsers[group.id] || []);
    const hasGroupRoles = useSelector((state: RootState) => !!state.roleGroups.hasGroupRoles[group.id]);
    const isLoadingGroupRoles = useSelector((state: RootState) => !!state.roleGroups.isLoadingRoles[group.id]);
    const isLoadingGroupUsers = useSelector((state: RootState) => !!state.groupUsers.isLoading[group.id]);
    const isDeletingUser = useSelector((state: RootState) => !!state.groupUsers.isDeleting[group.id]);
    const isDeletingRole = useSelector((state: RootState) => !!state.roleGroups.isDeletingRole[group.id]);
    const dispatch = useDispatch();

    const onUpdateName = useCallback(async (name: string) => {
        return dispatch(updateGroup({id: group.id, realmId: group.realmId, name}));
    }, [group]);
    const onUpdateDescription = useCallback(async (description: string) => {
        return dispatch(updateGroup({id: group.id, realmId: group.realmId, description}));
    }, [group]);
    const onDelete = useCallback(async() => {
        return dispatch(deleteGroup(group));
    }, [group]);
    const onFetchRoles = useCallback(async () => {
        if (!hasGroupRoles && !isLoadingGroupRoles) {
            dispatch(fetchGroupRoles(group));
        }
    }, [group, hasGroupRoles, isLoadingGroupRoles]);
    const onFetchUsers = useCallback(async () => {
        if (!userIds.length && !isLoadingGroupUsers) {
            dispatch(fetchGroupUsers(group));
        }
    }, [userIds, isLoadingGroupUsers, group]);
    return (
        <TableRow
            onFetchRoles={onFetchRoles}
            isLoadingRoles={isLoadingGroupRoles}
            roleIds={roleIds}
            userIds={userIds}
            group={group}
            onAddRole={async (role: Role) => await dispatch(createRoleGroup(role, group))}
            onAddUser={async (user: User) => await dispatch(createGroupUser(group, user))}
            onDeleteRole={async (role: Role) => await dispatch(deleteRoleGroup(role, group))}
            onDeleteUser={async (user: User) => await dispatch(deleteGroupUser(group, user))}
            onUpdateName={onUpdateName}
            onUpdateDescription={onUpdateDescription}
            onDelete={onDelete}
            error={error}
        />
    );
}

export default ConnectedTableRow;
