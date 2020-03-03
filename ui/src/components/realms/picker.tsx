import React, {useContext, useEffect, useState} from 'react';
import { Button, MenuItem } from "@blueprintjs/core";
import { Select } from "@blueprintjs/select";
import { store, actions, realm } from '../../store';

function Picker() {
    const state = useContext(store);
    const [loadingRealms, setLoadingRealms] = useState(false);
    useEffect(() => {
        if (state.realms.length !== 0) return;
        console.log('Realms::Picker::Fetch');
        setLoadingRealms(true);
        actions.fetchRealms().finally(() => setLoadingRealms(false));
    }, [state.realms.length])
    const RealmSelect = Select.ofType<realm>();
    const handleRealmSelect = (realm: realm) => {
        console.log({realm});
        actions.selectRealm(realm)
    }
    return (
        <RealmSelect
            onItemSelect={handleRealmSelect}
            filterable={state.realms.length > 6}
            items={state.realms}
            activeItem={state.realm}
            itemRenderer={(realm: realm) => <MenuItem key={realm.id} text={realm.name} onClick={() => handleRealmSelect(realm)}/>}
            noResults={<MenuItem disabled={true} text="No results." />}
        >
            {/* children become the popover target; render value here */}
            <Button loading={loadingRealms} text={`${'realm' in state ? state.realm?.name : 'Select'} Realm`} rightIcon="double-caret-vertical" />
        </RealmSelect>
    );
}

export default Picker;
