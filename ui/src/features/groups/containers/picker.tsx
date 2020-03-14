import React, { useEffect } from 'react';
import Picker from '../components/picker';
import {useDispatch, useSelector} from 'react-redux'
import {RootState} from '../../../app/rootReducer'
import {fetchGroups} from "../../../app/groupsList/groupsListSlice";
import {Group} from "../../../types";
interface props {
    onSelect: (group: Group) => Promise<any>;
    filterIds?: string[];
    title?: string;
}
function ConnectedPicker({onSelect, filterIds = [], title= "Select Group"}: props) {
    const dispatch = useDispatch();
    const selectedRealmId = useSelector((state: RootState) => state.realmsList.selectedRealmId);
    const selectedRealm = useSelector((state: RootState) => state.realmsList.realmsById[selectedRealmId || ''] || null);
    const groups = useSelector((state: RootState) => selectedRealmId ? state.groupsList.groupsByRealmId[selectedRealmId]  || []: []);
    const isLoading = useSelector((state: RootState) => selectedRealmId ? state.groupsList.isLoading[selectedRealmId] : false);
    const hasGroups =  useSelector((state: RootState) => selectedRealmId ? (!!state.groupsList.groupsByRealmId[selectedRealmId]) : false);

    useEffect(() => {
        if (!hasGroups && selectedRealm !== null && !isLoading && typeof groups !== 'undefined') {
            dispatch(fetchGroups(selectedRealm))
        }
    }, [dispatch, hasGroups, selectedRealm, groups]);
    return (
        <Picker
            groups={groups.filter((g) => !filterIds?.includes(g.id))}
            loading={isLoading}
            onSelect={onSelect}
            title={title}
        />
    );
}

export default ConnectedPicker;
