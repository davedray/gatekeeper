import React, { useEffect } from 'react';
import Picker from '../components/picker';
import {useDispatch, useSelector} from 'react-redux'
import {RootState} from '../../../app/rootReducer'
import {fetchRealms, selectRealm } from '../../../app/realmsList/realmsListSlice';
function ConnectedPicker() {
    const dispatch = useDispatch();
    const { realms, selectedRealm, isLoading } = useSelector((state: RootState) => state.realmsList);
    useEffect(() => {
        if (realms.length === 0) {
            dispatch(fetchRealms())
        }
    }, [dispatch, realms])
    return (
        <Picker realms={realms} loading={isLoading} selected={selectedRealm} onSelect={async (realm) => dispatch(selectRealm(realm))} />
    );
}

export default ConnectedPicker;
