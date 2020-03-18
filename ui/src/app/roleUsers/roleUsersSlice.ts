import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import actions from "../../http";
import {AppThunk} from "../store";
import { createErrorToast, createSuccessToast } from '../toasts/toastsSlice';
import {Role, User} from "../../types";
interface RoleUsersState {
    roleUsers: Record<string, string[]>;
    hasRoleUsers: Record<string, boolean>; // Lets you know if it has the *full* list of users for this role
    userRoles: Record<string, string[]>;
    hasUserRoles: Record<string, boolean>; // Lets you know if it has the *full* list of roles for this user
    error: string|null;
    isLoadingUsers: Record<string, boolean>;
    isCreatingUser: Record<string, boolean>;
    isDeletingUser: Record<string, boolean>;
    isLoadingRoles: Record<string, boolean>;
    isCreatingRole: Record<string, boolean>;
    isDeletingRole: Record<string, boolean>;
}

const roleUsersInitialState: RoleUsersState = {
    roleUsers: {},
    hasRoleUsers: {},
    userRoles: {},
    hasUserRoles: {},
    error: null,
    isLoadingUsers: {},
    isLoadingRoles: {},
    isCreatingUser: {},
    isCreatingRole: {},
    isDeletingUser: {},
    isDeletingRole: {},
};

function startLoadingUsers(state: RoleUsersState, action: PayloadAction<string>) {
    state.roleUsers[action.payload] = [];
    state.isLoadingUsers[action.payload] = true
}

function startLoadingRoles(state: RoleUsersState, action: PayloadAction<string>) {
    state.userRoles[action.payload] = [];
    state.isLoadingRoles[action.payload] = true
}

function startCreatingUser(state: RoleUsersState, action: PayloadAction<{role: string, user: string}>) {
    state.isCreatingUser[action.payload.role] = true;
    state.isCreatingRole[action.payload.user] = true;
}

function startDeletingUser(state: RoleUsersState, action: PayloadAction<{role: string, user: string}>) {
    state.isDeletingUser[action.payload.role] = true;
    state.isDeletingRole[action.payload.user] = true;
}

function loadingUsersFailed(state: RoleUsersState, action: PayloadAction<{role: string, error: string}>) {
    state.isLoadingUsers[action.payload.role] = false;
    state.error = action.payload.error
}

function loadingRolesFailed(state: RoleUsersState, action: PayloadAction<{user: string, error: string}>) {
    state.isLoadingRoles[action.payload.user] = false;
    state.error = action.payload.error
}

function creatingUserFailed(state: RoleUsersState, action: PayloadAction<{role: string, user: string, error: string}>) {
    state.isCreatingUser[action.payload.role] = false;
    state.isCreatingRole[action.payload.user] = false;
    state.error = action.payload.error;
}

function deletingUserFailed(state: RoleUsersState, action: PayloadAction<{role: string, user: string, error: string}>) {
    state.isCreatingUser[action.payload.role] = false;
    state.isCreatingRole[action.payload.user] = false;
    state.error = action.payload.error;
}

const roleUsers = createSlice({
    initialState: roleUsersInitialState,
    name: 'roleUsers',
    reducers: {
        getRoleUsersStart: startLoadingUsers,
        getRoleUsersFailure: loadingUsersFailed,
        getRoleUsersSuccess(state: RoleUsersState, {payload}: PayloadAction<{role: string, users: string[]}>) {
            payload.users.forEach((user) => {
                state.userRoles[user] = state.userRoles[user] || [];
                if (!state.roleUsers[payload.role].includes(user)) {
                    state.roleUsers[payload.role].push(user);
                }
                if (!state.userRoles[user].includes(payload.role)) {
                    state.userRoles[user].push(payload.role);
                }
            });
            state.error = null;
            state.isLoadingUsers[payload.role] = false;
            state.hasRoleUsers[payload.role] = true;
        },
        deleteRoleUserStart: startDeletingUser,
        deleteRoleUserFailure: deletingUserFailed,
        deleteRoleUserSuccess(state: RoleUsersState, {payload}: PayloadAction<{role: string, user: string}>) {
            const {role, user} = payload;
            state.roleUsers[role] = state.roleUsers[role].filter((r) => user !== r);
            state.userRoles[user] = state.userRoles[user].filter((r) => role !== r);
            state.error = null;
            state.isDeletingUser[role] = false;
            state.isDeletingRole[user] = false;
        },
        createRoleUserStart: startCreatingUser,
        createRoleUserFailure: creatingUserFailed,
        createRoleUserSuccess(state: RoleUsersState, {payload}: PayloadAction<{role: string, user: string}>) {
            const {role, user} = payload;
            state.roleUsers[role] = state.roleUsers[role] || [];
            state.userRoles[user] = state.userRoles[user] || [];
            state.roleUsers[role].push(user);
            state.userRoles[user].push(role);
            state.isCreatingUser[role] = false;
            state.isCreatingRole[user] = false;
            state.error = null;
        },
        getUserRolesStart: startLoadingRoles,
        getUserRolesFailure: loadingRolesFailed,
        getUserRolesSuccess(state: RoleUsersState, {payload}: PayloadAction<{user: string, roles: string[]}>) {
            payload.roles.forEach((role) => {
                state.roleUsers[role] =  state.roleUsers[role] || [];
                if (!state.userRoles[payload.user].includes(role)) {
                    state.userRoles[payload.user].push(role);
                }
                if (!state.roleUsers[role].includes(payload.user)) {
                    state.roleUsers[role].push(payload.user);
                }
            });
            state.error = null;
            state.isLoadingRoles[payload.user] = false;
            state.hasUserRoles[payload.user] = true;
        },
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
    deleteRoleUserSuccess,
    getUserRolesStart,
    getUserRolesFailure,
    getUserRolesSuccess,
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

export const fetchUserRoles = (user: User): AppThunk => async dispatch => {
    try {
        dispatch(getUserRolesStart(user.id));
        const roles = await actions.getUserRoles(user);
        return dispatch(getUserRolesSuccess({user: user.id, roles}));
    } catch (err) {
        dispatch(createErrorToast({
            message: err.toString() || "Could not fetch role's users"
        }));
        return dispatch(getUserRolesFailure({user: user.id, error: err.toString()}))
    }
};

export const createRoleUser = (role: Role, user: User): AppThunk => async dispatch => {
    try {
        dispatch(createRoleUserStart({role: role.id, user: user.id}));
        await actions.createRoleUser(role, user);
        dispatch(createSuccessToast({
            message: "User added to role"
        }));
        return dispatch(createRoleUserSuccess({role: role.id, user: user.id}));
    } catch (err) {
        dispatch(createErrorToast({
            message: err.toString() || 'Could not add user to role'
        }));
        return dispatch(createRoleUserFailure({role: role.id, user: user.id, error: err.toString()}));
    }
};

export const deleteRoleUser = (role: Role, user: User): AppThunk => async dispatch => {
    try {
        dispatch(deleteRoleUserStart({role: role.id, user: user.id}));
        await actions.deleteRoleUser(role, user);
        dispatch(createSuccessToast({
            message: "User removed from role"
        }));
        return dispatch(deleteRoleUserSuccess({role: role.id, user: user.id}));
    } catch (err) {
        dispatch(createErrorToast({
            message: err.toString() || 'Could not remove user from role'
        }));
        return dispatch(deleteRoleUserFailure({role: role.id, user: user.id, error: err.toString()}))
    }
};