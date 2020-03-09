import React from 'react';
import CreateForm from '../components/createForm';
import {useDispatch, useSelector} from 'react-redux'
import {RootState} from '../../../app/rootReducer'
import {createGroup} from '../../../app/groupsList/groupsListSlice';
import {NewGroup} from "../../../types";
function ConnectedCreateForm() {
    const dispatch = useDispatch();
    const error = useSelector((state: RootState) => state.usersList.error);
    const selectedRealmId = useSelector((state: RootState) => state.realmsList.selectedRealmId);
    const isCreating = useSelector((state: RootState) => selectedRealmId ? state.groupsList.isCreating[selectedRealmId] : false);
    const selectedRealm = useSelector((state: RootState) => selectedRealmId ? state.realmsList.realmsById[selectedRealmId] : null);
    return (
        <CreateForm realm={selectedRealm} onSave={async (group: Omit<NewGroup, "realmId">) => {
            let newGroup : NewGroup = Object.assign(group, {realmId: selectedRealmId!});
            dispatch(createGroup(selectedRealm!, newGroup));
        }} isSaving={isCreating} error={error}/>
    );
}

export default ConnectedCreateForm;
