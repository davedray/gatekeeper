import React, { useEffect } from 'react';
import Picker from '../components/picker';
import {useDispatch, useSelector} from 'react-redux'
import {RootState} from '../../../app/rootReducer'
import {fetchUsers} from "../../../app/usersList/usersListSlice";
import {User} from "../../../types";
interface props {
    onSelect: (user: User) => Promise<any>;
}
function ConnectedPicker({onSelect}: props) {
    const dispatch = useDispatch();
    const selectedRealmId = useSelector((state: RootState) => state.realmsList.selectedRealmId);
    const selectedRealm = useSelector((state: RootState) => state.realmsList.realmsById[selectedRealmId || ''] || null);
    const users = useSelector((state: RootState) => selectedRealmId ? state.usersList.usersByRealmId[selectedRealmId]  || []: []);
    const isLoading = useSelector((state: RootState) => selectedRealmId ? state.usersList.isLoading[selectedRealmId] : false);
    const hasUsers = users.length > 0;
    useEffect(() => {
        if (!hasUsers && selectedRealm !== null) {
            dispatch(fetchUsers(selectedRealm))
        }
    }, [dispatch, hasUsers, selectedRealm]);
    return (
        <Picker users={users} loading={isLoading} selected={selectedRealmId} onSelect={onSelect} />
    );
}

export default ConnectedPicker;
