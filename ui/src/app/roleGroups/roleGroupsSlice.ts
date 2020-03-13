import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import actions from "../../http";
import {AppThunk} from "../store";
import { createErrorToast, createSuccessToast } from '../toasts/toastsSlice';
import {Role, Group} from "../../types";
interface RoleGroupsState {
    roleGroups: Record<string, string[]>;
    hasRoleGroups: Record<string, boolean>; // Lets you know if it has the *full* list of groups for this role
    groupRoles: Record<string, string[]>;
    hasGroupRoles: Record<string, boolean>; // Lets you know if it has the *full* list of roles for this group
    error: string|null;
    isLoadingGroups: Record<string, boolean>;
    isCreatingGroup: Record<string, boolean>;
    isDeletingGroup: Record<string, boolean>;
    isLoadingRoles: Record<string, boolean>;
    isCreatingRole: Record<string, boolean>;
    isDeletingRole: Record<string, boolean>;
}

const roleGroupsInitialState: RoleGroupsState = {
    roleGroups: {},
    hasRoleGroups: {},
    groupRoles: {},
    hasGroupRoles: {},
    error: null,
    isLoadingGroups: {},
    isLoadingRoles: {},
    isCreatingGroup: {},
    isCreatingRole: {},
    isDeletingGroup: {},
    isDeletingRole: {},
};

function startLoadingGroups(state: RoleGroupsState, action: PayloadAction<string>) {
    state.roleGroups[action.payload] = [];
    state.isLoadingGroups[action.payload] = true
}

function startLoadingRoles(state: RoleGroupsState, action: PayloadAction<string>) {
    state.groupRoles[action.payload] = [];
    state.isLoadingRoles[action.payload] = true
}

function startCreatingGroup(state: RoleGroupsState, action: PayloadAction<{role: string, group: string}>) {
    state.isCreatingGroup[action.payload.role] = true;
    state.isCreatingRole[action.payload.group] = true;
}

function startDeletingGroup(state: RoleGroupsState, action: PayloadAction<{role: string, group: string}>) {
    state.isDeletingGroup[action.payload.role] = true;
    state.isDeletingRole[action.payload.group] = true;
}

function loadingGroupsFailed(state: RoleGroupsState, action: PayloadAction<{role: string, error: string}>) {
    state.isLoadingGroups[action.payload.role] = false;
    state.error = action.payload.error
}

function loadingRolesFailed(state: RoleGroupsState, action: PayloadAction<{group: string, error: string}>) {
    state.isLoadingRoles[action.payload.group] = false;
    state.error = action.payload.error
}

function creatingGroupFailed(state: RoleGroupsState, action: PayloadAction<{role: string, group: string, error: string}>) {
    state.isCreatingGroup[action.payload.role] = false;
    state.isCreatingRole[action.payload.group] = false;
    state.error = action.payload.error;
}

function deletingGroupFailed(state: RoleGroupsState, action: PayloadAction<{role: string, group: string, error: string}>) {
    state.isCreatingGroup[action.payload.role] = false;
    state.isCreatingRole[action.payload.group] = false;
    state.error = action.payload.error;
}

const roleGroups = createSlice({
    initialState: roleGroupsInitialState,
    name: 'roleGroups',
    reducers: {
        getRoleGroupsStart: startLoadingGroups,
        getRoleGroupsFailure: loadingGroupsFailed,
        getRoleGroupsSuccess(state: RoleGroupsState, {payload}: PayloadAction<{role: string, groups: string[]}>) {
            payload.groups.forEach((group) => {
                state.groupRoles[group] = state.groupRoles[group] || [];
                if (!state.roleGroups[payload.role].includes(group)) {
                    state.roleGroups[payload.role].push(group);
                }
                if (!state.groupRoles[group].includes(payload.role)) {
                    state.groupRoles[group].push(payload.role);
                }
            });
            state.error = null;
            state.isLoadingGroups[payload.role] = false;
            state.hasRoleGroups[payload.role] = true;
        },
        deleteRoleGroupStart: startDeletingGroup,
        deleteRoleGroupFailure: deletingGroupFailed,
        deleteRoleGroupSuccess(state: RoleGroupsState, {payload}: PayloadAction<{role: string, group: string}>) {
            const {role, group} = payload;
            state.roleGroups[role] = state.roleGroups[role].filter((r) => group !== r);
            state.groupRoles[group] = state.groupRoles[group].filter((r) => role !== r);
            state.error = null;
            state.isDeletingGroup[role] = false;
            state.isDeletingRole[group] = false;
        },
        createRoleGroupStart: startCreatingGroup,
        createRoleGroupFailure: creatingGroupFailed,
        createRoleGroupSuccess(state: RoleGroupsState, {payload}: PayloadAction<{role: string, group: string}>) {
            const {role, group} = payload;
            state.roleGroups[role] = state.roleGroups[role] || [];
            state.groupRoles[group] = state.groupRoles[group] || [];
            state.roleGroups[role].push(group);
            state.groupRoles[group].push(role);
            state.isCreatingGroup[role] = false;
            state.isCreatingRole[group] = false;
            state.error = null;
        },
        getGroupRolesStart: startLoadingRoles,
        getGroupRolesFailure: loadingRolesFailed,
        getGroupRolesSuccess(state: RoleGroupsState, {payload}: PayloadAction<{group: string, roles: string[]}>) {
            payload.roles.forEach((role) => {
                state.roleGroups[role] =  state.roleGroups[role] || [];
                if (!state.groupRoles[payload.group].includes(role)) {
                    state.groupRoles[payload.group].push(role);
                }
                if (!state.roleGroups[role].includes(payload.group)) {
                    state.roleGroups[role].push(payload.group);
                }
            });
            state.error = null;
            state.isLoadingRoles[payload.group] = false;
            state.hasGroupRoles[payload.group] = true;
        },
    }
});

export const {
    getRoleGroupsStart,
    getRoleGroupsFailure,
    getRoleGroupsSuccess,
    createRoleGroupStart,
    createRoleGroupFailure,
    createRoleGroupSuccess,
    deleteRoleGroupStart,
    deleteRoleGroupFailure,
    deleteRoleGroupSuccess,
    getGroupRolesStart,
    getGroupRolesFailure,
    getGroupRolesSuccess,
} =  roleGroups.actions;

export default roleGroups.reducer;

export const fetchRoleGroups = (role: Role): AppThunk => async dispatch => {
    try {
        dispatch(getRoleGroupsStart(role.id));
        const groups = await actions.getRoleGroups(role);
        return dispatch(getRoleGroupsSuccess({role: role.id, groups}));
    } catch (err) {
        dispatch(createErrorToast({
            message: err.toString() || "Could not fetch role's groups"
        }));
        return dispatch(getRoleGroupsFailure({role: role.id, error: err.toString()}))
    }
};

export const fetchGroupRoles = (group: Group): AppThunk => async dispatch => {
    try {
        dispatch(getGroupRolesStart(group.id));
        const roles = await actions.getGroupRoles(group);
        return dispatch(getGroupRolesSuccess({group: group.id, roles}));
    } catch (err) {
        dispatch(createErrorToast({
            message: err.toString() || "Could not fetch role's groups"
        }));
        return dispatch(getGroupRolesFailure({group: group.id, error: err.toString()}))
    }
};

export const createRoleGroup = (role: Role, group: Group): AppThunk => async dispatch => {
    try {
        dispatch(createRoleGroupStart({role: role.id, group: group.id}));
        await actions.createRoleGroup(role, group);
        dispatch(createSuccessToast({
            message: "Group added to role"
        }));
        return dispatch(createRoleGroupSuccess({role: role.id, group: group.id}));
    } catch (err) {
        dispatch(createErrorToast({
            message: err.toString() || 'Could not add group to role'
        }));
        return dispatch(createRoleGroupFailure({role: role.id, group: group.id, error: err.toString()}));
    }
};

export const deleteRoleGroup = (role: Role, group: Group): AppThunk => async dispatch => {
    try {
        dispatch(deleteRoleGroupStart({role: role.id, group: group.id}));
        await actions.deleteRoleGroup(role, group);
        dispatch(createSuccessToast({
            message: "Group removed from role"
        }));
        return dispatch(deleteRoleGroupSuccess({role: role.id, group: group.id}));
    } catch (err) {
        dispatch(createErrorToast({
            message: err.toString() || 'Could not remove group from role'
        }));
        return dispatch(deleteRoleGroupFailure({role: role.id, group: group.id, error: err.toString()}))
    }
};