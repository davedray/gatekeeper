import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import actions from "../../http";
import {AppThunk} from "../store";
import { createErrorToast, createSuccessToast } from '../toasts/toastsSlice';
import {Role, Permission} from "../../types";
interface RolePermissionsState {
    rolePermissions: Record<string, string[]>;
    hasRolePermissions: Record<string, boolean>; // Lets you know if it has the *full* list of permissions for this role
    permissionRoles: Record<string, string[]>;
    hasPermissionRoles: Record<string, boolean>; // Lets you know if it has the *full* list of roles for this permission
    error: string|null;
    isLoadingPermissions: Record<string, boolean>;
    isCreatingPermission: Record<string, boolean>;
    isDeletingPermission: Record<string, boolean>;
    isLoadingRoles: Record<string, boolean>;
    isCreatingRole: Record<string, boolean>;
    isDeletingRole: Record<string, boolean>;
}

const rolePermissionsInitialState: RolePermissionsState = {
    rolePermissions: {},
    hasRolePermissions: {},
    permissionRoles: {},
    hasPermissionRoles: {},
    error: null,
    isLoadingPermissions: {},
    isLoadingRoles: {},
    isCreatingPermission: {},
    isCreatingRole: {},
    isDeletingPermission: {},
    isDeletingRole: {},
};

function startLoadingPermissions(state: RolePermissionsState, action: PayloadAction<string>) {
    state.rolePermissions[action.payload] = [];
    state.isLoadingPermissions[action.payload] = true
}

function startLoadingRoles(state: RolePermissionsState, action: PayloadAction<string>) {
    state.permissionRoles[action.payload] = [];
    state.isLoadingRoles[action.payload] = true
}

function startCreatingPermission(state: RolePermissionsState, action: PayloadAction<{role: string, permission: string}>) {
    state.isCreatingPermission[action.payload.role] = true;
    state.isCreatingRole[action.payload.permission] = true;
}

function startDeletingPermission(state: RolePermissionsState, action: PayloadAction<{role: string, permission: string}>) {
    state.isDeletingPermission[action.payload.role] = true;
    state.isDeletingRole[action.payload.permission] = true;
}

function loadingPermissionsFailed(state: RolePermissionsState, action: PayloadAction<{role: string, error: string}>) {
    state.isLoadingPermissions[action.payload.role] = false;
    state.error = action.payload.error
}

function loadingRolesFailed(state: RolePermissionsState, action: PayloadAction<{permission: string, error: string}>) {
    state.isLoadingRoles[action.payload.permission] = false;
    state.error = action.payload.error
}

function creatingPermissionFailed(state: RolePermissionsState, action: PayloadAction<{role: string, permission: string, error: string}>) {
    state.isCreatingPermission[action.payload.role] = false;
    state.isCreatingRole[action.payload.permission] = false;
    state.error = action.payload.error;
}

function deletingPermissionFailed(state: RolePermissionsState, action: PayloadAction<{role: string, permission: string, error: string}>) {
    state.isCreatingPermission[action.payload.role] = false;
    state.isCreatingRole[action.payload.permission] = false;
    state.error = action.payload.error;
}

const rolePermissions = createSlice({
    initialState: rolePermissionsInitialState,
    name: 'rolePermissions',
    reducers: {
        getRolePermissionsStart: startLoadingPermissions,
        getRolePermissionsFailure: loadingPermissionsFailed,
        getRolePermissionsSuccess(state: RolePermissionsState, {payload}: PayloadAction<{role: string, permissions: string[]}>) {
            payload.permissions.forEach((permission) => {
                state.permissionRoles[permission] = state.permissionRoles[permission] || [];
                if (!state.rolePermissions[payload.role].includes(permission)) {
                    state.rolePermissions[payload.role].push(permission);
                }
                if (!state.permissionRoles[permission].includes(payload.role)) {
                    state.permissionRoles[permission].push(payload.role);
                }
            });
            state.error = null;
            state.isLoadingPermissions[payload.role] = false;
            state.hasRolePermissions[payload.role] = true;
        },
        deleteRolePermissionStart: startDeletingPermission,
        deleteRolePermissionFailure: deletingPermissionFailed,
        deleteRolePermissionSuccess(state: RolePermissionsState, {payload}: PayloadAction<{role: string, permission: string}>) {
            const {role, permission} = payload;
            state.rolePermissions[role] = state.rolePermissions[role].filter((r) => permission !== r);
            state.permissionRoles[permission] = state.permissionRoles[permission].filter((r) => role !== r);
            state.error = null;
            state.isDeletingPermission[role] = false;
            state.isDeletingRole[permission] = false;
        },
        createRolePermissionStart: startCreatingPermission,
        createRolePermissionFailure: creatingPermissionFailed,
        createRolePermissionSuccess(state: RolePermissionsState, {payload}: PayloadAction<{role: string, permission: string}>) {
            const {role, permission} = payload;
            state.rolePermissions[role] = state.rolePermissions[role] || [];
            state.permissionRoles[permission] = state.permissionRoles[permission] || [];
            state.rolePermissions[role].push(permission);
            state.permissionRoles[permission].push(role);
            state.isCreatingPermission[role] = false;
            state.isCreatingRole[permission] = false;
            state.error = null;
        },
        getPermissionRolesStart: startLoadingRoles,
        getPermissionRolesFailure: loadingRolesFailed,
        getPermissionRolesSuccess(state: RolePermissionsState, {payload}: PayloadAction<{permission: string, roles: string[]}>) {
            payload.roles.forEach((role) => {
                state.rolePermissions[role] =  state.rolePermissions[role] || [];
                if (!state.permissionRoles[payload.permission].includes(role)) {
                    state.permissionRoles[payload.permission].push(role);
                }
                if (!state.rolePermissions[role].includes(payload.permission)) {
                    state.rolePermissions[role].push(payload.permission);
                }
            });
            state.error = null;
            state.isLoadingRoles[payload.permission] = false;
            state.hasPermissionRoles[payload.permission] = true;
        },
    }
});

export const {
    getRolePermissionsStart,
    getRolePermissionsFailure,
    getRolePermissionsSuccess,
    createRolePermissionStart,
    createRolePermissionFailure,
    createRolePermissionSuccess,
    deleteRolePermissionStart,
    deleteRolePermissionFailure,
    deleteRolePermissionSuccess,
    getPermissionRolesStart,
    getPermissionRolesFailure,
    getPermissionRolesSuccess,
} =  rolePermissions.actions;

export default rolePermissions.reducer;

export const fetchRolePermissions = (role: Role): AppThunk => async dispatch => {
    try {
        dispatch(getRolePermissionsStart(role.id));
        const permissions = await actions.getRolePermissions(role);
        return dispatch(getRolePermissionsSuccess({role: role.id, permissions}));
    } catch (err) {
        dispatch(createErrorToast({
            message: err.toString() || "Could not fetch role's permissions"
        }));
        return dispatch(getRolePermissionsFailure({role: role.id, error: err.toString()}))
    }
};

export const fetchPermissionRoles = (permission: Permission): AppThunk => async dispatch => {
    try {
        dispatch(getPermissionRolesStart(permission.id));
        const roles = await actions.getPermissionRoles(permission);
        return dispatch(getPermissionRolesSuccess({permission: permission.id, roles}));
    } catch (err) {
        dispatch(createErrorToast({
            message: err.toString() || "Could not fetch role's permissions"
        }));
        return dispatch(getPermissionRolesFailure({permission: permission.id, error: err.toString()}))
    }
};

export const createRolePermission = (role: Role, permission: Permission): AppThunk => async dispatch => {
    try {
        dispatch(createRolePermissionStart({role: role.id, permission: permission.id}));
        await actions.createPermissionRole(permission, role);
        dispatch(createSuccessToast({
            message: "Permission added to role"
        }));
        return dispatch(createRolePermissionSuccess({role: role.id, permission: permission.id}));
    } catch (err) {
        dispatch(createErrorToast({
            message: err.toString() || 'Could not add permission to role'
        }));
        return dispatch(createRolePermissionFailure({role: role.id, permission: permission.id, error: err.toString()}));
    }
};

export const deleteRolePermission = (role: Role, permission: Permission): AppThunk => async dispatch => {
    try {
        dispatch(deleteRolePermissionStart({role: role.id, permission: permission.id}));
        await actions.deletePermissionRole(permission, role);
        dispatch(createSuccessToast({
            message: "Permission removed from role"
        }));
        return dispatch(deleteRolePermissionSuccess({role: role.id, permission: permission.id}));
    } catch (err) {
        dispatch(createErrorToast({
            message: err.toString() || 'Could not remove permission from role'
        }));
        return dispatch(deleteRolePermissionFailure({role: role.id, permission: permission.id, error: err.toString()}))
    }
};