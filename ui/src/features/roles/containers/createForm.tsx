import React from 'react';
import CreateForm from '../components/createForm';
import {useDispatch, useSelector} from 'react-redux'
import {RootState} from '../../../app/rootReducer'
import {createRole} from '../../../app/rolesList/rolesListSlice';
import {NewRole} from "../../../types";
function ConnectedCreateForm() {
    const dispatch = useDispatch();
    const error = useSelector((state: RootState) => state.usersList.error);
    const selectedRealmId = useSelector((state: RootState) => state.realmsList.selectedRealmId);
    const isCreating = useSelector((state: RootState) => selectedRealmId ? state.rolesList.isCreating[selectedRealmId] : false);
    const selectedRealm = useSelector((state: RootState) => selectedRealmId ? state.realmsList.realmsById[selectedRealmId] : null);
    return (
        <CreateForm realm={selectedRealm} onSave={async (role: Omit<NewRole, "realmId">) => {
            let newRole : NewRole = Object.assign(role, {realmId: selectedRealmId!});
            dispatch(createRole(selectedRealm!, newRole));
        }} isSaving={isCreating} error={error}/>
    );
}

export default ConnectedCreateForm;
