import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import actions from "../../http";
import {AppThunk} from "../store";
import { createErrorToast, createSuccessToast } from '../toasts/toastsSlice';
import {User, Permission} from "../../types";
interface UserPermissionsState {
    userPermissions: Record<string, string[]>;
    hasUserPermissions: Record<string, boolean>; // Lets you know if it has the *full* list of permissions for this user
    permissionUsers: Record<string, string[]>;
    hasPermissionUsers: Record<string, boolean>; // Lets you know if it has the *full* list of users for this permission
    error: string|null;
    isLoadingPermissions: Record<string, boolean>;
    isCreatingPermission: Record<string, boolean>;
    isDeletingPermission: Record<string, boolean>;
    isLoadingUsers: Record<string, boolean>;
    isCreatingUser: Record<string, boolean>;
    isDeletingUser: Record<string, boolean>;
}

const userPermissionsInitialState: UserPermissionsState = {
    userPermissions: {},
    hasUserPermissions: {},
    permissionUsers: {},
    hasPermissionUsers: {},
    error: null,
    isLoadingPermissions: {},
    isLoadingUsers: {},
    isCreatingPermission: {},
    isCreatingUser: {},
    isDeletingPermission: {},
    isDeletingUser: {},
};

function startLoadingPermissions(state: UserPermissionsState, action: PayloadAction<string>) {
    state.userPermissions[action.payload] = [];
    state.isLoadingPermissions[action.payload] = true
}

function startLoadingUsers(state: UserPermissionsState, action: PayloadAction<string>) {
    state.permissionUsers[action.payload] = [];
    state.isLoadingUsers[action.payload] = true
}

function startCreatingPermission(state: UserPermissionsState, action: PayloadAction<{user: string, permission: string}>) {
    state.isCreatingPermission[action.payload.user] = true;
    state.isCreatingUser[action.payload.permission] = true;
}

function startDeletingPermission(state: UserPermissionsState, action: PayloadAction<{user: string, permission: string}>) {
    state.isDeletingPermission[action.payload.user] = true;
    state.isDeletingUser[action.payload.permission] = true;
}

function loadingPermissionsFailed(state: UserPermissionsState, action: PayloadAction<{user: string, error: string}>) {
    state.isLoadingPermissions[action.payload.user] = false;
    state.error = action.payload.error
}

function loadingUsersFailed(state: UserPermissionsState, action: PayloadAction<{permission: string, error: string}>) {
    state.isLoadingUsers[action.payload.permission] = false;
    state.error = action.payload.error
}

function creatingPermissionFailed(state: UserPermissionsState, action: PayloadAction<{user: string, permission: string, error: string}>) {
    state.isCreatingPermission[action.payload.user] = false;
    state.isCreatingUser[action.payload.permission] = false;
    state.error = action.payload.error;
}

function deletingPermissionFailed(state: UserPermissionsState, action: PayloadAction<{user: string, permission: string, error: string}>) {
    state.isCreatingPermission[action.payload.user] = false;
    state.isCreatingUser[action.payload.permission] = false;
    state.error = action.payload.error;
}

const userPermissions = createSlice({
    initialState: userPermissionsInitialState,
    name: 'userPermissions',
    reducers: {
        getUserPermissionsStart: startLoadingPermissions,
        getUserPermissionsFailure: loadingPermissionsFailed,
        getUserPermissionsSuccess(state: UserPermissionsState, {payload}: PayloadAction<{user: string, permissions: string[]}>) {
            payload.permissions.forEach((permission) => {
                state.permissionUsers[permission] = state.permissionUsers[permission] || [];
                if (!state.userPermissions[payload.user].includes(permission)) {
                    state.userPermissions[payload.user].push(permission);
                }
                if (!state.permissionUsers[permission].includes(payload.user)) {
                    state.permissionUsers[permission].push(payload.user);
                }
            });
            state.error = null;
            state.isLoadingPermissions[payload.user] = false;
            state.hasUserPermissions[payload.user] = true;
        },
        deleteUserPermissionStart: startDeletingPermission,
        deleteUserPermissionFailure: deletingPermissionFailed,
        deleteUserPermissionSuccess(state: UserPermissionsState, {payload}: PayloadAction<{user: string, permission: string}>) {
            const {user, permission} = payload;
            state.userPermissions[user] = state.userPermissions[user].filter((r) => permission !== r);
            state.permissionUsers[permission] = state.permissionUsers[permission].filter((r) => user !== r);
            state.error = null;
            state.isDeletingPermission[user] = false;
            state.isDeletingUser[permission] = false;
        },
        createUserPermissionStart: startCreatingPermission,
        createUserPermissionFailure: creatingPermissionFailed,
        createUserPermissionSuccess(state: UserPermissionsState, {payload}: PayloadAction<{user: string, permission: string}>) {
            const {user, permission} = payload;
            state.userPermissions[user] = state.userPermissions[user] || [];
            state.permissionUsers[permission] = state.permissionUsers[permission] || [];
            state.userPermissions[user].push(permission);
            state.permissionUsers[permission].push(user);
            state.isCreatingPermission[user] = false;
            state.isCreatingUser[permission] = false;
            state.error = null;
        },
        getPermissionUsersStart: startLoadingUsers,
        getPermissionUsersFailure: loadingUsersFailed,
        getPermissionUsersSuccess(state: UserPermissionsState, {payload}: PayloadAction<{permission: string, users: string[]}>) {
            payload.users.forEach((user) => {
                state.userPermissions[user] =  state.userPermissions[user] || [];
                if (!state.permissionUsers[payload.permission].includes(user)) {
                    state.permissionUsers[payload.permission].push(user);
                }
                if (!state.userPermissions[user].includes(payload.permission)) {
                    state.userPermissions[user].push(payload.permission);
                }
            });
            state.error = null;
            state.isLoadingUsers[payload.permission] = false;
            state.hasPermissionUsers[payload.permission] = true;
        },
    }
});

export const {
    getUserPermissionsStart,
    getUserPermissionsFailure,
    getUserPermissionsSuccess,
    createUserPermissionStart,
    createUserPermissionFailure,
    createUserPermissionSuccess,
    deleteUserPermissionStart,
    deleteUserPermissionFailure,
    deleteUserPermissionSuccess,
    getPermissionUsersStart,
    getPermissionUsersFailure,
    getPermissionUsersSuccess,
} =  userPermissions.actions;

export default userPermissions.reducer;

export const fetchUserPermissions = (user: User): AppThunk => async dispatch => {
    try {
        dispatch(getUserPermissionsStart(user.id));
        const permissions = await actions.getUserPermissions(user);
        return dispatch(getUserPermissionsSuccess({user: user.id, permissions}));
    } catch (err) {
        dispatch(createErrorToast({
            message: err.toString() || "Could not fetch user's permissions"
        }));
        return dispatch(getUserPermissionsFailure({user: user.id, error: err.toString()}))
    }
};

export const fetchPermissionUsers = (permission: Permission): AppThunk => async dispatch => {
    try {
        dispatch(getPermissionUsersStart(permission.id));
        const users = await actions.getPermissionUsers(permission);
        return dispatch(getPermissionUsersSuccess({permission: permission.id, users}));
    } catch (err) {
        dispatch(createErrorToast({
            message: err.toString() || "Could not fetch user's permissions"
        }));
        return dispatch(getPermissionUsersFailure({permission: permission.id, error: err.toString()}))
    }
};

export const createUserPermission = (user: User, permission: Permission): AppThunk => async dispatch => {
    try {
        dispatch(createUserPermissionStart({user: user.id, permission: permission.id}));
        await actions.createPermissionUser(permission, user);
        dispatch(createSuccessToast({
            message: "Permission added to user"
        }));
        return dispatch(createUserPermissionSuccess({user: user.id, permission: permission.id}));
    } catch (err) {
        dispatch(createErrorToast({
            message: err.toString() || 'Could not add permission to user'
        }));
        return dispatch(createUserPermissionFailure({user: user.id, permission: permission.id, error: err.toString()}));
    }
};

export const deleteUserPermission = (user: User, permission: Permission): AppThunk => async dispatch => {
    try {
        dispatch(deleteUserPermissionStart({user: user.id, permission: permission.id}));
        await actions.deletePermissionUser(permission, user);
        dispatch(createSuccessToast({
            message: "Permission removed from user"
        }));
        return dispatch(deleteUserPermissionSuccess({user: user.id, permission: permission.id}));
    } catch (err) {
        dispatch(createErrorToast({
            message: err.toString() || 'Could not remove permission from user'
        }));
        return dispatch(deleteUserPermissionFailure({user: user.id, permission: permission.id, error: err.toString()}))
    }
};