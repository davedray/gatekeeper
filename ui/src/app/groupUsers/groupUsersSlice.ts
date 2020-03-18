import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import actions from "../../http";
import {AppThunk} from "../store";
import { createErrorToast, createSuccessToast } from '../toasts/toastsSlice';
import {User, Group} from "../../types";
interface UserGroupsState {
    userGroups: Record<string, string[]>;
    hasUserGroups: Record<string, boolean>; // Lets you know if it has the *full* list of groups for this user
    groupUsers: Record<string, string[]>;
    hasGroupUsers: Record<string, boolean>; // Lets you know if it has the *full* list of users for this group
    error: string|null;
    isLoadingGroups: Record<string, boolean>;
    isCreatingGroup: Record<string, boolean>;
    isDeletingGroup: Record<string, boolean>;
    isLoadingUsers: Record<string, boolean>;
    isCreatingUser: Record<string, boolean>;
    isDeletingUser: Record<string, boolean>;
}

const userGroupsInitialState: UserGroupsState = {
    userGroups: {},
    hasUserGroups: {},
    groupUsers: {},
    hasGroupUsers: {},
    error: null,
    isLoadingGroups: {},
    isLoadingUsers: {},
    isCreatingGroup: {},
    isCreatingUser: {},
    isDeletingGroup: {},
    isDeletingUser: {},
};

function startLoadingGroups(state: UserGroupsState, action: PayloadAction<string>) {
    state.userGroups[action.payload] = [];
    state.isLoadingGroups[action.payload] = true
}

function startLoadingUsers(state: UserGroupsState, action: PayloadAction<string>) {
    state.groupUsers[action.payload] = [];
    state.isLoadingUsers[action.payload] = true
}

function startCreatingGroup(state: UserGroupsState, action: PayloadAction<{user: string, group: string}>) {
    state.isCreatingGroup[action.payload.user] = true;
    state.isCreatingUser[action.payload.group] = true;
}

function startDeletingGroup(state: UserGroupsState, action: PayloadAction<{user: string, group: string}>) {
    state.isDeletingGroup[action.payload.user] = true;
    state.isDeletingUser[action.payload.group] = true;
}

function loadingGroupsFailed(state: UserGroupsState, action: PayloadAction<{user: string, error: string}>) {
    state.isLoadingGroups[action.payload.user] = false;
    state.error = action.payload.error
}

function loadingUsersFailed(state: UserGroupsState, action: PayloadAction<{group: string, error: string}>) {
    state.isLoadingUsers[action.payload.group] = false;
    state.error = action.payload.error
}

function creatingGroupFailed(state: UserGroupsState, action: PayloadAction<{user: string, group: string, error: string}>) {
    state.isCreatingGroup[action.payload.user] = false;
    state.isCreatingUser[action.payload.group] = false;
    state.error = action.payload.error;
}

function deletingGroupFailed(state: UserGroupsState, action: PayloadAction<{user: string, group: string, error: string}>) {
    state.isCreatingGroup[action.payload.user] = false;
    state.isCreatingUser[action.payload.group] = false;
    state.error = action.payload.error;
}

const userGroups = createSlice({
    initialState: userGroupsInitialState,
    name: 'userGroups',
    reducers: {
        getUserGroupsStart: startLoadingGroups,
        getUserGroupsFailure: loadingGroupsFailed,
        getUserGroupsSuccess(state: UserGroupsState, {payload}: PayloadAction<{user: string, groups: string[]}>) {
            payload.groups.forEach((group) => {
                state.groupUsers[group] = state.groupUsers[group] || [];
                if (!state.userGroups[payload.user].includes(group)) {
                    state.userGroups[payload.user].push(group);
                }
                if (!state.groupUsers[group].includes(payload.user)) {
                    state.groupUsers[group].push(payload.user);
                }
            });
            state.error = null;
            state.isLoadingGroups[payload.user] = false;
            state.hasUserGroups[payload.user] = true;
        },
        deleteUserGroupStart: startDeletingGroup,
        deleteUserGroupFailure: deletingGroupFailed,
        deleteUserGroupSuccess(state: UserGroupsState, {payload}: PayloadAction<{user: string, group: string}>) {
            const {user, group} = payload;
            state.userGroups[user] = state.userGroups[user].filter((r) => group !== r);
            state.groupUsers[group] = state.groupUsers[group].filter((r) => user !== r);
            state.error = null;
            state.isDeletingGroup[user] = false;
            state.isDeletingUser[group] = false;
        },
        createUserGroupStart: startCreatingGroup,
        createUserGroupFailure: creatingGroupFailed,
        createUserGroupSuccess(state: UserGroupsState, {payload}: PayloadAction<{user: string, group: string}>) {
            const {user, group} = payload;
            state.userGroups[user] = state.userGroups[user] || [];
            state.groupUsers[group] = state.groupUsers[group] || [];
            state.userGroups[user].push(group);
            state.groupUsers[group].push(user);
            state.isCreatingGroup[user] = false;
            state.isCreatingUser[group] = false;
            state.error = null;
        },
        getGroupUsersStart: startLoadingUsers,
        getGroupUsersFailure: loadingUsersFailed,
        getGroupUsersSuccess(state: UserGroupsState, {payload}: PayloadAction<{group: string, users: string[]}>) {
            payload.users.forEach((user) => {
                state.userGroups[user] =  state.userGroups[user] || [];
                if (!state.groupUsers[payload.group].includes(user)) {
                    state.groupUsers[payload.group].push(user);
                }
                if (!state.userGroups[user].includes(payload.group)) {
                    state.userGroups[user].push(payload.group);
                }
            });
            state.error = null;
            state.isLoadingUsers[payload.group] = false;
            state.hasGroupUsers[payload.group] = true;
        },
    }
});

export const {
    getUserGroupsStart,
    getUserGroupsFailure,
    getUserGroupsSuccess,
    createUserGroupStart,
    createUserGroupFailure,
    createUserGroupSuccess,
    deleteUserGroupStart,
    deleteUserGroupFailure,
    deleteUserGroupSuccess,
    getGroupUsersStart,
    getGroupUsersFailure,
    getGroupUsersSuccess,
} =  userGroups.actions;

export default userGroups.reducer;

export const fetchUserGroups = (user: User): AppThunk => async dispatch => {
    try {
        dispatch(getUserGroupsStart(user.id));
        const groups = await actions.getUserGroups(user);
        return dispatch(getUserGroupsSuccess({user: user.id, groups}));
    } catch (err) {
        dispatch(createErrorToast({
            message: err.toString() || "Could not fetch user's groups"
        }));
        return dispatch(getUserGroupsFailure({user: user.id, error: err.toString()}))
    }
};

export const fetchGroupUsers = (group: Group): AppThunk => async dispatch => {
    try {
        dispatch(getGroupUsersStart(group.id));
        const users = await actions.getGroupUsers(group);
        return dispatch(getGroupUsersSuccess({group: group.id, users}));
    } catch (err) {
        dispatch(createErrorToast({
            message: err.toString() || "Could not fetch user's groups"
        }));
        return dispatch(getGroupUsersFailure({group: group.id, error: err.toString()}))
    }
};

export const createUserGroup = (user: User, group: Group): AppThunk => async dispatch => {
    try {
        dispatch(createUserGroupStart({user: user.id, group: group.id}));
        await actions.createGroupUser(group, user);
        dispatch(createSuccessToast({
            message: "Group added to user"
        }));
        return dispatch(createUserGroupSuccess({user: user.id, group: group.id}));
    } catch (err) {
        dispatch(createErrorToast({
            message: err.toString() || 'Could not add group to user'
        }));
        return dispatch(createUserGroupFailure({user: user.id, group: group.id, error: err.toString()}));
    }
};

export const deleteUserGroup = (user: User, group: Group): AppThunk => async dispatch => {
    try {
        dispatch(deleteUserGroupStart({user: user.id, group: group.id}));
        await actions.deleteGroupUser(group, user);
        dispatch(createSuccessToast({
            message: "Group removed from user"
        }));
        return dispatch(deleteUserGroupSuccess({user: user.id, group: group.id}));
    } catch (err) {
        dispatch(createErrorToast({
            message: err.toString() || 'Could not remove group from user'
        }));
        return dispatch(deleteUserGroupFailure({user: user.id, group: group.id, error: err.toString()}))
    }
};