import React from 'react';
import CreateForm from '../components/createForm';
import {useDispatch, useSelector} from 'react-redux'
import {RootState} from '../../../app/rootReducer'
import {createPermission} from '../../../app/permissionsList/permissionsListSlice';
import {NewPermission} from "../../../types";
function ConnectedCreateForm() {
    const dispatch = useDispatch();
    const error = useSelector((state: RootState) => state.usersList.error);
    const selectedRealmId = useSelector((state: RootState) => state.realmsList.selectedRealmId);
    const isCreating = useSelector((state: RootState) => selectedRealmId ? state.permissionsList.isCreating[selectedRealmId] : false);
    const selectedRealm = useSelector((state: RootState) => selectedRealmId ? state.realmsList.realmsById[selectedRealmId] : null);
    return (
        <CreateForm realm={selectedRealm} onSave={async (permission: Omit<NewPermission, "realmId">) => {
            let newPermission : NewPermission = Object.assign(permission, {realmId: selectedRealmId!});
            dispatch(createPermission(selectedRealm!, newPermission));
        }} isSaving={isCreating} error={error}/>
    );
}

export default ConnectedCreateForm;
