import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import actions from "../../http";
import {AppThunk} from "../store";
import { createErrorToast, createSuccessToast } from '../toasts/toastsSlice';
import {Group, User} from "../../types";
interface GroupUsersState {
    groupUsers: Record<string, string[]>;
    error: string|null;
    isLoading: Record<string, boolean>;
    isCreating: Record<string, boolean>;
    isDeleting: Record<string, boolean>;
}

const groupUsersInitialState: GroupUsersState = {
    groupUsers: {},
    error: null,
    isLoading: {},
    isCreating: {},
    isDeleting: {}
};

function startLoading(state: GroupUsersState, action: PayloadAction<string>) {
    state.groupUsers[action.payload] = [];
    state.isLoading[action.payload] = true
}

function startCreating(state: GroupUsersState, action: PayloadAction<string>) {
    state.isCreating[action.payload] = true;
}

function startDeleting(state: GroupUsersState, action: PayloadAction<string>) {
    state.isDeleting[action.payload] = true;
}

function loadingFailed(state: GroupUsersState, action: PayloadAction<{group: string, error: string}>) {
    state.isLoading[action.payload.group] = false;
    state.error = action.payload.error
}

function creatingFailed(state: GroupUsersState, action: PayloadAction<{group: string, error: string}>) {
    state.isCreating[action.payload.group] = false;
    state.error = action.payload.error;
}

function deletingFailed(state: GroupUsersState, action: PayloadAction<{group: string, error: string}>) {
    state.isCreating[action.payload.group] = false;
    state.error = action.payload.error;
}

const groupUsers = createSlice({
    initialState: groupUsersInitialState,
    name: 'groupUsers',
    reducers: {
        getGroupUsersStart: startLoading,
        getGroupUsersFailure: loadingFailed,
        getGroupUsersSuccess(state: GroupUsersState, {payload}: PayloadAction<{group: string, users: string[]}>) {
            payload.users.forEach((user) => {
                state.groupUsers[payload.group].push(user);
            });
            state.error = null;
            state.isLoading[payload.group] = false;
        },
        deleteGroupUserStart: startDeleting,
        deleteGroupUserFailure: deletingFailed,
        deleteGroupUserSuccess(state: GroupUsersState, {payload}: PayloadAction<{group: string, user: string}>) {
            const {group, user} = payload;
            state.groupUsers[group] = state.groupUsers[group].filter((r) => user !== r);
            state.error = null;
            state.isDeleting[group] = false;
        },
        createGroupUserStart: startCreating,
        createGroupUserFailure: creatingFailed,
        createGroupUserSuccess(state: GroupUsersState, {payload}: PayloadAction<{group: string, user: string}>) {
            const {group, user} = payload;
            state.groupUsers[group].push(user);
            state.isCreating[group] = false;
            state.error = null;
        }
    }
});

export const {
    getGroupUsersStart,
    getGroupUsersFailure,
    getGroupUsersSuccess,
    createGroupUserStart,
    createGroupUserFailure,
    createGroupUserSuccess,
    deleteGroupUserStart,
    deleteGroupUserFailure,
    deleteGroupUserSuccess
} =  groupUsers.actions;

export default groupUsers.reducer;

export const fetchGroupUsers = (group: Group): AppThunk => async dispatch => {
    try {
        dispatch(getGroupUsersStart(group.id));
        const users = await actions.getGroupUsers(group);
        return dispatch(getGroupUsersSuccess({group: group.id, users}));
    } catch (err) {
        dispatch(createErrorToast({
            message: err.toString() || "Could not fetch group's users"
        }));
        return dispatch(getGroupUsersFailure({group: group.id, error: err.toString()}))
    }
};

export const createGroupUser = (group: Group, user: User): AppThunk => async dispatch => {
    try {
        dispatch(createGroupUserStart(group.id));
        await actions.createGroupUser(group, user);
        dispatch(createSuccessToast({
            message: "User added to group"
        }));
        return dispatch(createGroupUserSuccess({group: group.id, user: user.id}));
    } catch (err) {
        dispatch(createErrorToast({
            message: err.toString() || 'Could not add user to group'
        }));
        return dispatch(createGroupUserFailure({group: group.id, error: err.toString()}));
    }
};

export const deleteGroupUser = (group: Group, user: User): AppThunk => async dispatch => {
    try {
        dispatch(deleteGroupUserStart(group.id));
        await actions.deleteGroupUser(group, user);
        dispatch(createSuccessToast({
            message: "User removed from group"
        }));
        return dispatch(deleteGroupUserSuccess({group: group.id, user: user.id}));
    } catch (err) {
        dispatch(createErrorToast({
            message: err.toString() || 'Could not remove user from group'
        }));
        return dispatch(deleteGroupUserFailure({group: group.id, error: err.toString()}))
    }
};