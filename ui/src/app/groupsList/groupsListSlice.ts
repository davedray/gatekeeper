import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {NewGroup, Realm, Group, UpdateGroup} from '../../types';
import actions, { GroupsResult, GroupResult} from "../../http";
import {AppThunk} from "../store";
import { createErrorToast, createSuccessToast } from '../toasts/toastsSlice';
interface GroupsListState {
    groupsByRealmId: Record<string, Group[]>;
    groupsById: Record<string, Group>;
    error: string|null;
    isLoading: Record<string, boolean>;
    isCreating: Record<string, boolean>;
    isSaving: Record<string, boolean>;
    isDeleting: Record<string, boolean>;
}

const groupsListInitialState: GroupsListState = {
    groupsByRealmId: {},
    groupsById: {},
    error: null,
    isLoading: {},
    isCreating: {},
    isSaving: {},
    isDeleting: {}
};

function startLoading(state: GroupsListState, action: PayloadAction<string>) {
    state.groupsByRealmId[action.payload] = [];
    state.isLoading[action.payload] = true
}

function startSaving(state: GroupsListState, action: PayloadAction<string>) {
    state.isSaving[action.payload] = true;
}

function startCreating(state: GroupsListState, action: PayloadAction<string>) {
    state.isCreating[action.payload] = true;
}

function loadingFailed(state: GroupsListState, action: PayloadAction<{realm: string, error: string}>) {
    state.isLoading[action.payload.realm] = false;
    state.error = action.payload.error
}

function savingFailed(state: GroupsListState, action: PayloadAction<{group: string, error: string}>) {
    state.isSaving[action.payload.group] = false;
    state.error = action.payload.error;
}

function creatingFailed(state: GroupsListState, action: PayloadAction<{realm: string, error: string}>) {
    state.isCreating[action.payload.realm] = false;
    state.error = action.payload.error;
}

const groupsList = createSlice({
    initialState: groupsListInitialState,
    name: 'groupsList',
    reducers: {
        getGroupsStart: startLoading,
        getGroupsFailure: loadingFailed,
        getGroupsSuccess(state: GroupsListState, {payload}: PayloadAction<{realm: Realm, groups: GroupsResult}>) {
            const {groups} = payload.groups;
            groups.sort((a, b) => a.name.localeCompare(b.name));
            groups.forEach((group) => {
                state.groupsByRealmId[group.realmId].push(group);
            })
            state.error = null;
            state.isLoading[payload.realm.id] = false;
            groups.forEach((group) => state.groupsById[group.id] = group);
        },
        updateGroupStart: startSaving,
        updateGroupFailure: savingFailed,
        updateGroupSuccess(state: GroupsListState, {payload}: PayloadAction<GroupResult>) {
            const group = payload;
            let { groupsByRealmId, groupsById } = state;
            let index = groupsByRealmId[group.realmId].findIndex((r) => r.id === group.id);
            if (index !== -1) {
                groupsByRealmId[group.realmId].splice(index, 1, group);
            }
            groupsById[group.id] = group;
            state.error = null;
            state.isSaving[group.id] = false;
        },
        deleteGroupStart: startSaving,
        deleteGroupFailure: savingFailed,
        deleteGroupSuccess(state: GroupsListState, {payload}: PayloadAction<GroupResult>) {
            const group = payload;
            state.groupsByRealmId[group.realmId] = state.groupsByRealmId[group.realmId].filter((r) => group.id !== r.id);
            state.error = null;
            state.isSaving[group.id] = false;
            delete(state.groupsById[group.id]);
        },
        createGroupStart: startCreating,
        createGroupFailure: creatingFailed,
        createGroupSuccess(state: GroupsListState, {payload}: PayloadAction<GroupResult>) {
            const group = payload;
            state.groupsByRealmId[group.realmId].push(group);
            state.groupsByRealmId[group.realmId].sort((a, b) => a.name.localeCompare(b.name));
            state.groupsById[group.id] = group;
            state.isCreating[group.realmId] = false;
            state.error = null;
        }
    }
});

export const {
    getGroupsStart,
    getGroupsFailure,
    getGroupsSuccess,
    createGroupStart,
    createGroupFailure,
    createGroupSuccess,
    updateGroupStart,
    updateGroupFailure,
    updateGroupSuccess,
    deleteGroupStart,
    deleteGroupFailure,
    deleteGroupSuccess
} =  groupsList.actions;

export default groupsList.reducer;

export const fetchGroups = (realm: Realm): AppThunk => async dispatch => {
    try {
        dispatch(getGroupsStart(realm.id));
        const groups = await actions.getGroups(realm);
        return dispatch(getGroupsSuccess({realm, groups}));
    } catch (err) {
        dispatch(createErrorToast({
            message: err.toString() || 'Could not fetch groups'
        }));
        return dispatch(getGroupsFailure({realm: realm.id, error: err.toString()}))
    }
};

export const createGroup = (realm: Realm, group: NewGroup): AppThunk => async dispatch => {
    try {
        dispatch(createGroupStart(realm.id));
        const updated = await actions.createGroup(realm, group);
        dispatch(createSuccessToast({
            message: "Group Created"
        }));
        return dispatch(createGroupSuccess(updated));
    } catch (err) {
        dispatch(createErrorToast({
            message: err.toString() || 'Could not create group'
        }));
        return dispatch(createGroupFailure({realm: realm.id, error: err.toString()}));
    }
};

export const deleteGroup = (group: Group): AppThunk => async dispatch => {
    try {
        dispatch(deleteGroupStart(group.realmId));
        await actions.deleteGroup(group);
        dispatch(createSuccessToast({
            message: "Group Deleted"
        }));
        return dispatch(deleteGroupSuccess(group));
    } catch (err) {
        dispatch(createErrorToast({
            message: err.toString() || 'Could not delete group'
        }));
        return dispatch(deleteGroupFailure({group: group.id, error: err.toString()}))
    }
};

export const updateGroup = (patch: UpdateGroup): AppThunk => async dispatch => {
    try {
        dispatch(updateGroupStart(patch.id));
        const group = await actions.updateGroup(patch);
        dispatch(createSuccessToast({
            message: 'Group updated'
        }));
        return dispatch(updateGroupSuccess(group));
    } catch (err) {
        dispatch(createErrorToast({
            message: err.toString() || 'Could not update group'
        }));
        return dispatch(updateGroupFailure({group: patch.id, error: err.toString()}));
    }
};