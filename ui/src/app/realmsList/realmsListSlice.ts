import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Realm } from '../../types';
import actions, { RealmsResult, RealmResult} from "../../http";
import {AppThunk} from "../store";
import { createErrorToast, createSuccessToast } from '../toasts/toastsSlice';
interface RealmsListState {
    realms: Realm[];
    selectedRealm: Realm|null;
    realmsById: Record<string, Realm>;
    error: string|null;
    isLoading: boolean;
    isCreating: boolean;
    isSaving: Record<string, boolean>;
    isDeleting: Record<string, boolean>;
}

const realmsListInitialState: RealmsListState = {
    realms: [],
    selectedRealm: null,
    realmsById: {},
    error: null,
    isLoading: false,
    isCreating: false,
    isSaving: {},
    isDeleting: {}
};

function startLoading(state: RealmsListState) {
    state.isLoading = true
}

function startSaving(state: RealmsListState, action: PayloadAction<string>) {
    state.isSaving[action.payload] = true;
}

function startCreating(state: RealmsListState) {
    state.isCreating = true;
}

function loadingFailed(state: RealmsListState, action: PayloadAction<string>) {
    state.isLoading = false;
    state.error = action.payload
}

function savingFailed(state: RealmsListState, action: PayloadAction<{id: string, error: string}>) {
    state.isSaving[action.payload.id] = false;
    state.error = action.payload.error;
}

function creatingFailed(state: RealmsListState, action: PayloadAction<string>) {
    state.isCreating = false;
    state.error = action.payload;
}

const realmsList = createSlice({
    initialState: realmsListInitialState,
    name: 'realmsList',
    reducers: {
        getRealmsStart: startLoading,
        getRealmsFailure: loadingFailed,
        getRealmsSuccess(state: RealmsListState, {payload}: PayloadAction<RealmsResult>) {
            const {realms} = payload;
            realms.sort((a, b) => a.name.localeCompare(b.name));
            state.realms = realms;
            state.error = null;
            state.isLoading = false;
            realms.forEach((realm) => state.realmsById[realm.id] = realm);
        },
        updateRealmStart: startSaving,
        updateRealmFailure: savingFailed,
        updateRealmSuccess(state: RealmsListState, {payload}: PayloadAction<RealmResult>) {
            const realm = payload;
            let { realms } = state;
            const index = realms.findIndex((r) => r.id === realm.id);
            if (index !== -1) {
                realms.splice(index, 1, realm);
            }
            realms.sort((a, b) => a.name.localeCompare(b.name));
            state.error = null;
            state.isSaving[realm.id] = false;
            state.realmsById[realm.id] = realm;
            if (state.selectedRealm !== null && state.selectedRealm.id === realm.id && !realm.enabled) {
                state.selectedRealm = null;
            }
        },
        deleteRealmStart: startSaving,
        deleteRealmFailure: savingFailed,
        deleteRealmSuccess(state: RealmsListState, {payload}: PayloadAction<RealmResult>) {
            const realm = payload;
            state.realms = state.realms.filter((r) => realm.id !== r.id);
            state.error = null;
            state.isSaving[realm.id] = false;
            if (state.selectedRealm !== null && state.selectedRealm.id === realm.id) {
                state.selectedRealm = null;
            }
            delete(state.realmsById[realm.id]);
        },
        createRealmStart: startCreating,
        createRealmFailure: creatingFailed,
        createRealmSuccess(state: RealmsListState, {payload}: PayloadAction<RealmResult>) {
            const realm = payload;
            state.realms.push(realm);
            state.realms.sort((a, b) => a.name.localeCompare(b.name));
            state.realmsById[realm.id] = realm;
            state.isCreating = false;
            state.error = null;
        },
        selectRealm(state: RealmsListState, {payload}: PayloadAction<Realm>) {
            state.selectedRealm = payload;
        }
    }
});

export const {
    selectRealm,
    getRealmsStart,
    getRealmsFailure,
    getRealmsSuccess,
    createRealmStart,
    createRealmFailure,
    createRealmSuccess,
    updateRealmStart,
    updateRealmFailure,
    updateRealmSuccess,
    deleteRealmStart,
    deleteRealmFailure,
    deleteRealmSuccess
} =  realmsList.actions;

export default realmsList.reducer;

export const fetchRealms = (): AppThunk => async dispatch => {
    try {
        dispatch(getRealmsStart());
        const realms = await actions.getRealms();
        return dispatch(getRealmsSuccess(realms));
    } catch (err) {
        dispatch(createErrorToast({
            message: err.toString() || 'Could not fetch realms'
        }));
        return dispatch(getRealmsFailure(err.toString()))
    }
};

export const createRealm = (realm: Omit<Realm, "id">): AppThunk => async dispatch => {
    try {
        dispatch(createRealmStart());
        const updated = await actions.createRealm(realm);
        dispatch(createSuccessToast({
            message: "Realm Created"
        }));
        return dispatch(createRealmSuccess(updated));
    } catch (err) {
        dispatch(createErrorToast({
            message: err.toString() || 'Could not create realm'
        }));
        return dispatch(createRealmFailure(err.toString()))
    }
};

export const updateRealm = (realm: Realm): AppThunk => async dispatch => {
    try {
        dispatch(updateRealmStart(realm.id));
        const updated = await actions.updateRealm(realm);
        dispatch(createSuccessToast({
            message: "Realm Updated"
        }));
        return dispatch(updateRealmSuccess(updated));
    } catch (err) {
        dispatch(createErrorToast({
            message: err.toString() || 'Could not update realm'
        }));
        return dispatch(updateRealmFailure({ id: realm.id, error: err.toString() }))
    }
};

export const deleteRealm = (realm: Realm): AppThunk => async dispatch => {
    try {
        dispatch(deleteRealmStart(realm.id));
        await actions.deleteRealm(realm);
        dispatch(createSuccessToast({
            message: "Realm Deleted"
        }));
        return dispatch(deleteRealmSuccess(realm));
    } catch (err) {
        dispatch(createErrorToast({
            message: err.toString() || 'Could not delete realm'
        }));
        return dispatch(deleteRealmFailure({id: realm.id, error: err.toString()}))
    }
};
