import React, { useEffect } from 'react';
import Picker from '../components/picker';
import {useDispatch, useSelector} from 'react-redux'
import {RootState} from '../../../app/rootReducer'
import {fetchRoles} from "../../../app/rolesList/rolesListSlice";
import {Role} from "../../../types";
interface props {
    onSelect: (role: Role) => Promise<any>;
    roles?: Role[];
    filterIds?: string[];
    title?: string;
}
function ConnectedPicker({onSelect, filterIds = [], title= "Select Role"}: props) {
    const dispatch = useDispatch();
    const selectedRealmId = useSelector((state: RootState) => state.realmsList.selectedRealmId);
    const selectedRealm = useSelector((state: RootState) => state.realmsList.realmsById[selectedRealmId || ''] || null);
    const roles = useSelector((state: RootState) => selectedRealmId ? state.rolesList.rolesByRealmId[selectedRealmId]  || []: []);
    const isLoading = useSelector((state: RootState) => selectedRealmId ? state.rolesList.isLoading[selectedRealmId] : false);
    const hasRoles = roles.length > 0;
    useEffect(() => {
        if (!hasRoles && selectedRealm !== null && !isLoading && typeof roles !== 'undefined') {
            dispatch(fetchRoles(selectedRealm))
        }
    }, [dispatch, hasRoles, selectedRealm, roles]);
    return (
        <Picker
            roles={roles.filter((u) => !filterIds?.includes(u.id))}
            loading={isLoading}
            selected={selectedRealmId}
            onSelect={onSelect}
            title={title}
        />
    );
}

export default ConnectedPicker;
