import React from 'react';
import CreateForm from '../components/createForm';
import {useDispatch, useSelector} from 'react-redux'
import {RootState} from '../../../app/rootReducer'
import {createRealm} from '../../../app/realmsList/realmsListSlice';
function ConnectedCreateForm() {
    const dispatch = useDispatch();
    const { isCreating, error } = useSelector((state: RootState) => state.realmsList);
    return (
        <CreateForm onSave={async (realm) => dispatch(createRealm(realm))} isSaving={isCreating} error={error}/>
    );
}

export default ConnectedCreateForm;
