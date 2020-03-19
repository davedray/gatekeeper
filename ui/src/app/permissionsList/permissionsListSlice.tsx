import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {NewPermission, Realm, Permission, UpdatePermission} from '../../types';
import actions, { PermissionsResult, PermissionResult} from "../../http";
import {AppThunk} from "../store";
import { createErrorToast, createSuccessToast } from '../toasts/toastsSlice';
interface PermissionsListState {
    permissionsByRealmId: Record<string, Permission[]>;
    permissionsById: Record<string, Permission>;
    isLoaded: Record<string, boolean>;
    error: string|null;
    isLoading: Record<string, boolean>;
    isCreating: Record<string, boolean>;
    isSaving: Record<string, boolean>;
    isDeleting: Record<string, boolean>;
}

const permissionsListInitialState: PermissionsListState = {
    permissionsByRealmId: {},
    permissionsById: {},
    isLoaded: {},
    error: null,
    isLoading: {},
    isCreating: {},
    isSaving: {},
    isDeleting: {}
};

function startLoading(state: PermissionsListState, action: PayloadAction<string>) {
    state.permissionsByRealmId[action.payload] = [];
    state.isLoading[action.payload] = true
}

function startSaving(state: PermissionsListState, action: PayloadAction<string>) {
    state.isSaving[action.payload] = true;
}

function startCreating(state: PermissionsListState, action: PayloadAction<string>) {
    state.isCreating[action.payload] = true;
}

function loadingFailed(state: PermissionsListState, action: PayloadAction<{realm: string, error: string}>) {
    state.isLoading[action.payload.realm] = false;
    state.error = action.payload.error
}

function savingFailed(state: PermissionsListState, action: PayloadAction<{permission: string, error: string}>) {
    state.isSaving[action.payload.permission] = false;
    state.error = action.payload.error;
}

function creatingFailed(state: PermissionsListState, action: PayloadAction<{realm: string, error: string}>) {
    state.isCreating[action.payload.realm] = false;
    state.error = action.payload.error;
}

const permissionsList = createSlice({
    initialState: permissionsListInitialState,
    name: 'permissionsList',
    reducers: {
        getPermissionsStart: startLoading,
        getPermissionsFailure: loadingFailed,
        getPermissionsSuccess(state: PermissionsListState, {payload}: PayloadAction<{realm: Realm, permissions: PermissionsResult}>) {
            const {permissions} = payload.permissions;
            permissions.sort((a, b) => a.name.localeCompare(b.name));
            permissions.forEach((permission) => {
                state.permissionsByRealmId[permission.realmId].push(permission);
            })
            state.error = null;
            state.isLoading[payload.realm.id] = false;
            permissions.forEach((permission) => state.permissionsById[permission.id] = permission);
            state.isLoaded[payload.realm.id] = true;
        },
        updatePermissionStart: startSaving,
        updatePermissionFailure: savingFailed,
        updatePermissionSuccess(state: PermissionsListState, {payload}: PayloadAction<PermissionResult>) {
            const permission = payload;
            let { permissionsByRealmId, permissionsById } = state;
            let index = permissionsByRealmId[permission.realmId].findIndex((r) => r.id === permission.id);
            if (index !== -1) {
                permissionsByRealmId[permission.realmId].splice(index, 1, permission);
            }
            permissionsById[permission.id] = permission;
            state.error = null;
            state.isSaving[permission.id] = false;
        },
        deletePermissionStart: startSaving,
        deletePermissionFailure: savingFailed,
        deletePermissionSuccess(state: PermissionsListState, {payload}: PayloadAction<PermissionResult>) {
            const permission = payload;
            state.permissionsByRealmId[permission.realmId] = state.permissionsByRealmId[permission.realmId].filter((r) => permission.id !== r.id);
            state.error = null;
            state.isSaving[permission.id] = false;
            delete(state.permissionsById[permission.id]);
        },
        createPermissionStart: startCreating,
        createPermissionFailure: creatingFailed,
        createPermissionSuccess(state: PermissionsListState, {payload}: PayloadAction<PermissionResult>) {
            const permission = payload;
            state.permissionsByRealmId[permission.realmId].push(permission);
            state.permissionsByRealmId[permission.realmId].sort((a, b) => a.name.localeCompare(b.name));
            state.permissionsById[permission.id] = permission;
            state.isCreating[permission.realmId] = false;
            state.error = null;
        }
    }
});

export const {
    getPermissionsStart,
    getPermissionsFailure,
    getPermissionsSuccess,
    createPermissionStart,
    createPermissionFailure,
    createPermissionSuccess,
    updatePermissionStart,
    updatePermissionFailure,
    updatePermissionSuccess,
    deletePermissionStart,
    deletePermissionFailure,
    deletePermissionSuccess
} =  permissionsList.actions;

export default permissionsList.reducer;

export const fetchPermissions = (realm: Realm): AppThunk => async dispatch => {
    try {
        dispatch(getPermissionsStart(realm.id));
        const permissions = await actions.getPermissions(realm);
        return dispatch(getPermissionsSuccess({realm, permissions}));
    } catch (err) {
        dispatch(createErrorToast({
            message: err.toString() || 'Could not fetch permissions'
        }));
        return dispatch(getPermissionsFailure({realm: realm.id, error: err.toString()}))
    }
};

export const createPermission = (realm: Realm, permission: NewPermission): AppThunk => async dispatch => {
    try {
        dispatch(createPermissionStart(realm.id));
        const updated = await actions.createPermission(realm, permission);
        dispatch(createSuccessToast({
            message: "Permission Created"
        }));
        return dispatch(createPermissionSuccess(updated));
    } catch (err) {
        dispatch(createErrorToast({
            message: err.toString() || 'Could not create permission'
        }));
        return dispatch(createPermissionFailure({realm: realm.id, error: err.toString()}));
    }
};

export const deletePermission = (permission: Permission): AppThunk => async dispatch => {
    try {
        dispatch(deletePermissionStart(permission.realmId));
        await actions.deletePermission(permission);
        dispatch(createSuccessToast({
            message: "Permission Deleted"
        }));
        return dispatch(deletePermissionSuccess(permission));
    } catch (err) {
        dispatch(createErrorToast({
            message: err.toString() || 'Could not delete permission'
        }));
        return dispatch(deletePermissionFailure({permission: permission.id, error: err.toString()}))
    }
};

export const updatePermission = (patch: UpdatePermission): AppThunk => async dispatch => {
    try {
        dispatch(updatePermissionStart(patch.id));
        const permission = await actions.updatePermission(patch);
        dispatch(createSuccessToast({
            message: 'Permission updated'
        }));
        return dispatch(updatePermissionSuccess(permission));
    } catch (err) {
        dispatch(createErrorToast({
            message: err.toString() || 'Could not update permission'
        }));
        return dispatch(updatePermissionFailure({permission: patch.id, error: err.toString()}));
    }
};