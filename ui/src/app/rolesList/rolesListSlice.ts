import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {NewRole, Realm, Role, UpdateRole} from '../../types';
import actions, { RolesResult, RoleResult} from "../../http";
import {AppThunk} from "../store";
import { createErrorToast, createSuccessToast } from '../toasts/toastsSlice';
interface RolesListState {
    rolesByRealmId: Record<string, Role[]>;
    rolesById: Record<string, Role>;
    hasRoles: Record<string, boolean>;
    error: string|null;
    isLoading: Record<string, boolean>;
    isCreating: Record<string, boolean>;
    isSaving: Record<string, boolean>;
    isDeleting: Record<string, boolean>;
}

const rolesListInitialState: RolesListState = {
    rolesByRealmId: {},
    rolesById: {},
    hasRoles: {},
    error: null,
    isLoading: {},
    isCreating: {},
    isSaving: {},
    isDeleting: {}
};

function startLoading(state: RolesListState, action: PayloadAction<string>) {
    state.rolesByRealmId[action.payload] = [];
    state.isLoading[action.payload] = true
}

function startSaving(state: RolesListState, action: PayloadAction<string>) {
    state.isSaving[action.payload] = true;
}

function startCreating(state: RolesListState, action: PayloadAction<string>) {
    state.isCreating[action.payload] = true;
}

function loadingFailed(state: RolesListState, action: PayloadAction<{realm: string, error: string}>) {
    state.isLoading[action.payload.realm] = false;
    state.error = action.payload.error
}

function savingFailed(state: RolesListState, action: PayloadAction<{role: string, error: string}>) {
    state.isSaving[action.payload.role] = false;
    state.error = action.payload.error;
}

function creatingFailed(state: RolesListState, action: PayloadAction<{realm: string, error: string}>) {
    state.isCreating[action.payload.realm] = false;
    state.error = action.payload.error;
}

const rolesList = createSlice({
    initialState: rolesListInitialState,
    name: 'rolesList',
    reducers: {
        getRolesStart: startLoading,
        getRolesFailure: loadingFailed,
        getRolesSuccess(state: RolesListState, {payload}: PayloadAction<{realm: Realm, roles: RolesResult}>) {
            const {roles} = payload.roles;
            roles.sort((a, b) => a.name.localeCompare(b.name));
            roles.forEach((role) => {
                state.rolesByRealmId[role.realmId].push(role);
            })
            state.error = null;
            state.isLoading[payload.realm.id] = false;
            roles.forEach((role) => state.rolesById[role.id] = role);
            state.hasRoles[payload.realm.id] = true;
        },
        updateRoleStart: startSaving,
        updateRoleFailure: savingFailed,
        updateRoleSuccess(state: RolesListState, {payload}: PayloadAction<RoleResult>) {
            const role = payload;
            let { rolesByRealmId, rolesById } = state;
            let index = rolesByRealmId[role.realmId].findIndex((r) => r.id === role.id);
            if (index !== -1) {
                rolesByRealmId[role.realmId].splice(index, 1, role);
            }
            rolesById[role.id] = role;
            state.error = null;
            state.isSaving[role.id] = false;
        },
        deleteRoleStart: startSaving,
        deleteRoleFailure: savingFailed,
        deleteRoleSuccess(state: RolesListState, {payload}: PayloadAction<RoleResult>) {
            const role = payload;
            state.rolesByRealmId[role.realmId] = state.rolesByRealmId[role.realmId].filter((r) => role.id !== r.id);
            state.error = null;
            state.isSaving[role.id] = false;
            delete(state.rolesById[role.id]);
        },
        createRoleStart: startCreating,
        createRoleFailure: creatingFailed,
        createRoleSuccess(state: RolesListState, {payload}: PayloadAction<RoleResult>) {
            const role = payload;
            state.rolesByRealmId[role.realmId].push(role);
            state.rolesByRealmId[role.realmId].sort((a, b) => a.name.localeCompare(b.name));
            state.rolesById[role.id] = role;
            state.isCreating[role.realmId] = false;
            state.error = null;
        }
    }
});

export const {
    getRolesStart,
    getRolesFailure,
    getRolesSuccess,
    createRoleStart,
    createRoleFailure,
    createRoleSuccess,
    updateRoleStart,
    updateRoleFailure,
    updateRoleSuccess,
    deleteRoleStart,
    deleteRoleFailure,
    deleteRoleSuccess
} =  rolesList.actions;

export default rolesList.reducer;

export const fetchRoles = (realm: Realm): AppThunk => async dispatch => {
    try {
        dispatch(getRolesStart(realm.id));
        const roles = await actions.getRoles(realm);
        return dispatch(getRolesSuccess({realm, roles}));
    } catch (err) {
        dispatch(createErrorToast({
            message: err.toString() || 'Could not fetch roles'
        }));
        return dispatch(getRolesFailure({realm: realm.id, error: err.toString()}))
    }
};

export const createRole = (realm: Realm, role: NewRole): AppThunk => async dispatch => {
    try {
        dispatch(createRoleStart(realm.id));
        const updated = await actions.createRole(realm, role);
        dispatch(createSuccessToast({
            message: "Role Created"
        }));
        return dispatch(createRoleSuccess(updated));
    } catch (err) {
        dispatch(createErrorToast({
            message: err.toString() || 'Could not create role'
        }));
        return dispatch(createRoleFailure({realm: realm.id, error: err.toString()}));
    }
};

export const deleteRole = (role: Role): AppThunk => async dispatch => {
    try {
        dispatch(deleteRoleStart(role.realmId));
        await actions.deleteRole(role);
        dispatch(createSuccessToast({
            message: "Role Deleted"
        }));
        return dispatch(deleteRoleSuccess(role));
    } catch (err) {
        dispatch(createErrorToast({
            message: err.toString() || 'Could not delete role'
        }));
        return dispatch(deleteRoleFailure({role: role.id, error: err.toString()}))
    }
};

export const updateRole = (patch: UpdateRole): AppThunk => async dispatch => {
    try {
        dispatch(updateRoleStart(patch.id));
        const role = await actions.updateRole(patch);
        dispatch(createSuccessToast({
            message: 'Role updated'
        }));
        return dispatch(updateRoleSuccess(role));
    } catch (err) {
        dispatch(createErrorToast({
            message: err.toString() || 'Could not update role'
        }));
        return dispatch(updateRoleFailure({role: patch.id, error: err.toString()}));
    }
};