import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import actions from "../../http";
import {AppThunk} from "../store";
import { createErrorToast, createSuccessToast } from '../toasts/toastsSlice';
import {Role, User} from "../../types";
interface RoleUsersState {
    roleUsers: Record<string, string[]>;
    error: string|null;
    isLoading: Record<string, boolean>;
    isCreating: Record<string, boolean>;
    isDeleting: Record<string, boolean>;
}

const roleUsersInitialState: RoleUsersState = {
    roleUsers: {},
    error: null,
    isLoading: {},
    isCreating: {},
    isDeleting: {}
};

function startLoading(state: RoleUsersState, action: PayloadAction<string>) {
    state.roleUsers[action.payload] = [];
    state.isLoading[action.payload] = true
}

function startCreating(state: RoleUsersState, action: PayloadAction<string>) {
    state.isCreating[action.payload] = true;
}

function startDeleting(state: RoleUsersState, action: PayloadAction<string>) {
    state.isDeleting[action.payload] = true;
}

function loadingFailed(state: RoleUsersState, action: PayloadAction<{role: string, error: string}>) {
    state.isLoading[action.payload.role] = false;
    state.error = action.payload.error
}

function creatingFailed(state: RoleUsersState, action: PayloadAction<{role: string, error: string}>) {
    state.isCreating[action.payload.role] = false;
    state.error = action.payload.error;
}

function deletingFailed(state: RoleUsersState, action: PayloadAction<{role: string, error: string}>) {
    state.isCreating[action.payload.role] = false;
    state.error = action.payload.error;
}

const roleUsers = createSlice({
    initialState: roleUsersInitialState,
    name: 'roleUsers',
    reducers: {
        getRoleUsersStart: startLoading,
        getRoleUsersFailure: loadingFailed,
        getRoleUsersSuccess(state: RoleUsersState, {payload}: PayloadAction<{role: string, users: string[]}>) {
            payload.users.forEach((user) => {
                state.roleUsers[payload.role].push(user);
            });
            state.error = null;
            state.isLoading[payload.role] = false;
        },
        deleteRoleUserStart: startDeleting,
        deleteRoleUserFailure: deletingFailed,
        deleteRoleUserSuccess(state: RoleUsersState, {payload}: PayloadAction<{role: string, user: string}>) {
            const {role, user} = payload;
            state.roleUsers[role] = state.roleUsers[role].filter((r) => user !== r);
            state.error = null;
            state.isDeleting[role] = false;
        },
        createRoleUserStart: startCreating,
        createRoleUserFailure: creatingFailed,
        createRoleUserSuccess(state: RoleUsersState, {payload}: PayloadAction<{role: string, user: string}>) {
            const {role, user} = payload;
            state.roleUsers[role].push(user);
            state.isCreating[role] = false;
            state.error = null;
        }
    }
});

export const {
    getRoleUsersStart,
    getRoleUsersFailure,
    getRoleUsersSuccess,
    createRoleUserStart,
    createRoleUserFailure,
    createRoleUserSuccess,
    deleteRoleUserStart,
    deleteRoleUserFailure,
    deleteRoleUserSuccess
} =  roleUsers.actions;

export default roleUsers.reducer;

export const fetchRoleUsers = (role: Role): AppThunk => async dispatch => {
    try {
        dispatch(getRoleUsersStart(role.id));
        const users = await actions.getRoleUsers(role);
        return dispatch(getRoleUsersSuccess({role: role.id, users}));
    } catch (err) {
        dispatch(createErrorToast({
            message: err.toString() || "Could not fetch role's users"
        }));
        return dispatch(getRoleUsersFailure({role: role.id, error: err.toString()}))
    }
};

export const createRoleUser = (role: Role, user: User): AppThunk => async dispatch => {
    try {
        dispatch(createRoleUserStart(role.id));
        await actions.createRoleUser(role, user);
        dispatch(createSuccessToast({
            message: "User added to role"
        }));
        return dispatch(createRoleUserSuccess({role: role.id, user: user.id}));
    } catch (err) {
        dispatch(createErrorToast({
            message: err.toString() || 'Could not add user to role'
        }));
        return dispatch(createRoleUserFailure({role: role.id, error: err.toString()}));
    }
};

export const deleteRoleUser = (role: Role, user: User): AppThunk => async dispatch => {
    try {
        dispatch(deleteRoleUserStart(role.id));
        await actions.deleteRoleUser(role, user);
        dispatch(createSuccessToast({
            message: "User removed from role"
        }));
        return dispatch(deleteRoleUserSuccess({role: role.id, user: user.id}));
    } catch (err) {
        dispatch(createErrorToast({
            message: err.toString() || 'Could not remove user from role'
        }));
        return dispatch(deleteRoleUserFailure({role: role.id, error: err.toString()}))
    }
};