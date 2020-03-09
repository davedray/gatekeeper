import React from 'react';
import CreateForm from '../components/createForm';
import {useDispatch, useSelector} from 'react-redux'
import {RootState} from '../../../app/rootReducer'
import {createUser} from '../../../app/usersList/usersListSlice';
import {Realm, NewUser} from "../../../types";
function ConnectedCreateForm() {
    const dispatch = useDispatch();
    const error = useSelector((state: RootState) => state.usersList.error);
    const selectedRealmId = useSelector((state: RootState) => state.realmsList.selectedRealmId);
    const isCreating = useSelector((state: RootState) => selectedRealmId ? state.usersList.isCreating[selectedRealmId] : false);
    const selectedRealm = useSelector((state: RootState) => selectedRealmId ? state.realmsList.realmsById[selectedRealmId] : null);
    return (
        <CreateForm realm={selectedRealm} onSave={async (realm: Realm, user: NewUser) => dispatch(createUser(selectedRealm!, user))} isSaving={isCreating} error={error}/>
    );
}

export default ConnectedCreateForm;
