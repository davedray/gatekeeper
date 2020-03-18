import React, {useCallback, useEffect} from 'react';
import {User, Group} from "../../../types";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../app/rootReducer";
import {fetchUserGroups, createUserGroup, deleteUserGroup} from "../../../app/groupUsers/groupUsersSlice";
import GroupDrawer from '../../groups/components/groupDrawer';
import {fetchGroups} from "../../../app/groupsList/groupsListSlice";
interface props {
    isOpen: boolean;
    onClose: () => any;
    user: User;
    title: string;
}
function ConnectedGroupDrawer({isOpen, onClose, title, user}: props) {
    const dispatch = useDispatch();
    const selectedRealm = useSelector((state: RootState) => state.realmsList.realmsById[state.realmsList.selectedRealmId || '']);
    const groupIds = useSelector((state: RootState) => state.groupUsers.userGroups[user.id] || []);
    const groups = useSelector((state: RootState) => groupIds.map((id) => state.groupsList.groupsById[id]).filter(i => i));
    const isLoadingUserGroups = useSelector((state: RootState) => state.groupUsers.isLoadingGroups[user.id] || false);
    const isLoadingGroups = useSelector((state: RootState) => state.groupsList.isLoading[state.realmsList.selectedRealmId || ''] || false);
    const hasGroupUsers = useSelector((state: RootState) => state.groupUsers.hasUserGroups[user.id] || false);
    const hasGroups = useSelector((state: RootState) => state.groupsList.isLoaded[state.realmsList.selectedRealmId || ''] || false);
    useEffect(() => {
        if (!hasGroupUsers && !isLoadingUserGroups && isOpen) {
            dispatch(fetchUserGroups(user));
        }
    }, [dispatch, user, hasGroupUsers, isLoadingUserGroups, isOpen]);
    useEffect(() => {
        if (!hasGroups && !isLoadingGroups && isOpen) {
            dispatch(fetchGroups(selectedRealm));
        }
    }, [dispatch, user, hasGroups, isLoadingGroups, selectedRealm, isOpen]);
    const onAddGroup = useCallback(async (group: Group) => {
        return dispatch(createUserGroup(user, group));
    }, [dispatch, user]);
    const onDeleteGroup = useCallback(async (group: Group) => {
        return dispatch(deleteUserGroup(user, group));
    }, [dispatch, user]);
    return (
        <GroupDrawer
            isLoading={isLoadingUserGroups || isLoadingGroups}
            isOpen={isOpen}
            onAddGroup={onAddGroup}
            onDeleteGroup={onDeleteGroup}
            selectedGroupIds={groupIds}
            onClose={onClose}
            groups={groups}
            title={`${user.username} Groups`}
            emptyStateDescription="Add a group to this user to populate this list"
        />
    );
}

export default ConnectedGroupDrawer;
