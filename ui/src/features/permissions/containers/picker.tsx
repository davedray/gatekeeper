import React, { useEffect } from 'react';
import Picker from '../components/picker';
import {useDispatch, useSelector} from 'react-redux'
import {RootState} from '../../../app/rootReducer'
import {fetchPermissions} from "../../../app/permissionsList/permissionsListSlice";
import {Permission} from "../../../types";
interface props {
    onSelect: (permission: Permission) => Promise<any>;
    filterIds?: string[];
    title?: string;
}
function ConnectedPicker({onSelect, filterIds = [], title= "Select Permission"}: props) {
    const dispatch = useDispatch();
    const selectedRealmId = useSelector((state: RootState) => state.realmsList.selectedRealmId);
    const selectedRealm = useSelector((state: RootState) => state.realmsList.realmsById[selectedRealmId || ''] || null);
    const permissions = useSelector((state: RootState) => selectedRealmId ? state.permissionsList.permissionsByRealmId[selectedRealmId]  || []: []);
    const isLoading = useSelector((state: RootState) => selectedRealmId ? state.permissionsList.isLoading[selectedRealmId] : false);
    const hasPermissions =  useSelector((state: RootState) => selectedRealmId ? (!!state.permissionsList.permissionsByRealmId[selectedRealmId]) : false);

    useEffect(() => {
        if (!hasPermissions && selectedRealm !== null && !isLoading && typeof permissions !== 'undefined') {
            dispatch(fetchPermissions(selectedRealm))
        }
    }, [dispatch, hasPermissions, selectedRealm, permissions, isLoading]);
    return (
        <Picker
            permissions={permissions.filter((g) => !filterIds?.includes(g.id))}
            loading={isLoading}
            onSelect={onSelect}
            title={title}
        />
    );
}

export default ConnectedPicker;
