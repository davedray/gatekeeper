import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {NewUser, Realm, User} from '../../types';
import actions, { UsersResult, UserResult} from "../../http";
import {AppThunk} from "../store";
import { createErrorToast, createSuccessToast } from '../toasts/toastsSlice';
interface UsersListState {
    usersByRealmId: Record<string, User[]>;
    usersById: Record<string, User>;
    error: string|null;
    isLoading: Record<string, boolean>;
    isCreating: Record<string, boolean>;
    isSaving: Record<string, boolean>;
    isDeleting: Record<string, boolean>;
}

const usersListInitialState: UsersListState = {
    usersByRealmId: {},
    usersById: {},
    error: null,
    isLoading: {},
    isCreating: {},
    isSaving: {},
    isDeleting: {}
};

function startLoading(state: UsersListState, action: PayloadAction<string>) {
    state.usersByRealmId[action.payload] = [];
    state.isLoading[action.payload] = true
}

function startSaving(state: UsersListState, action: PayloadAction<string>) {
    state.isSaving[action.payload] = true;
}

function startCreating(state: UsersListState, action: PayloadAction<string>) {
    state.isCreating[action.payload] = true;
}

function loadingFailed(state: UsersListState, action: PayloadAction<{realm: string, error: string}>) {
    state.isLoading[action.payload.realm] = false;
    state.error = action.payload.error
}

function savingFailed(state: UsersListState, action: PayloadAction<{user: string, error: string}>) {
    state.isSaving[action.payload.user] = false;
    state.error = action.payload.error;
}

function creatingFailed(state: UsersListState, action: PayloadAction<{realm: string, error: string}>) {
    state.isCreating[action.payload.realm] = false;
    state.error = action.payload.error;
}

const usersList = createSlice({
    initialState: usersListInitialState,
    name: 'usersList',
    reducers: {
        getUsersStart: startLoading,
        getUsersFailure: loadingFailed,
        getUsersSuccess(state: UsersListState, {payload}: PayloadAction<{realm: Realm, users: UsersResult}>) {
            const {users} = payload.users;
            users.sort((a, b) => a.username.localeCompare(b.username));
            users.forEach((user) => {
                state.usersByRealmId[user.realmId].push(user);
            })
            state.error = null;
            state.isLoading[payload.realm.id] = false;
            users.forEach((user) => state.usersById[user.id] = user);
        },
        updateUserStart: startSaving,
        updateUserFailure: savingFailed,
        updateUserSuccess(state: UsersListState, {payload}: PayloadAction<UserResult>) {
            const user = payload;
            let { usersByRealmId, usersById } = state;
            let index = usersByRealmId[user.realmId].findIndex((r) => r.id === user.id);
            if (index !== -1) {
                usersByRealmId[user.realmId].splice(index, 1, user);
            }
            usersById[user.id] = user;
            state.error = null;
            state.isSaving[user.id] = false;
        },
        deleteUserStart: startSaving,
        deleteUserFailure: savingFailed,
        deleteUserSuccess(state: UsersListState, {payload}: PayloadAction<UserResult>) {
            const user = payload;
            state.usersByRealmId[user.realmId] = state.usersByRealmId[user.realmId].filter((r) => user.id !== r.id);
            state.error = null;
            state.isSaving[user.id] = false;
            delete(state.usersById[user.id]);
        },
        createUserStart: startCreating,
        createUserFailure: creatingFailed,
        createUserSuccess(state: UsersListState, {payload}: PayloadAction<UserResult>) {
            const user = payload;
            state.usersByRealmId[user.realmId].push(user);
            state.usersByRealmId[user.realmId].sort((a, b) => a.username.localeCompare(b.username));
            state.usersById[user.id] = user;
            state.isCreating[user.realmId] = false;
            state.error = null;
        }
    }
});

export const {
    getUsersStart,
    getUsersFailure,
    getUsersSuccess,
    createUserStart,
    createUserFailure,
    createUserSuccess,
    updateUserStart,
    updateUserFailure,
    updateUserSuccess,
    deleteUserStart,
    deleteUserFailure,
    deleteUserSuccess
} =  usersList.actions;

export default usersList.reducer;

export const fetchUsers = (realm: Realm): AppThunk => async dispatch => {
    try {
        dispatch(getUsersStart(realm.id));
        const users = await actions.getUsers(realm);
        return dispatch(getUsersSuccess({realm, users}));
    } catch (err) {
        dispatch(createErrorToast({
            message: err.toString() || 'Could not fetch users'
        }));
        return dispatch(getUsersFailure({realm: realm.id, error: err.toString()}))
    }
};

export const createUser = (realm: Realm, user: NewUser): AppThunk => async dispatch => {
    try {
        dispatch(createUserStart(realm.id));
        const updated = await actions.createUser(realm, user);
        dispatch(createSuccessToast({
            message: "User Created"
        }));
        return dispatch(createUserSuccess(updated));
    } catch (err) {
        dispatch(createErrorToast({
            message: err.toString() || 'Could not create user'
        }));
        return dispatch(createUserFailure(err.toString()))
    }
};

export const deleteUser = (user: User): AppThunk => async dispatch => {
    try {
        dispatch(deleteUserStart(user.realmId));
        await actions.deleteUser(user);
        dispatch(createSuccessToast({
            message: "User Deleted"
        }));
        return dispatch(deleteUserSuccess(user));
    } catch (err) {
        dispatch(createErrorToast({
            message: err.toString() || 'Could not delete user'
        }));
        return dispatch(deleteUserFailure({user: user.id, error: err.toString()}))
    }
};
