import React from 'react';
import { Button, MenuItem } from "@blueprintjs/core";
import { IconNames } from "@blueprintjs/icons";
import { Select } from "@blueprintjs/select";
import './picker.scss';
import {Realm} from "../../../types";

interface props {
    realms: Realm[];
    loading: boolean;
    selected: Realm|null;
    onSelect: (realm: Realm) => Promise<any>;
}

function Picker({realms, loading, selected, onSelect}: props) {
    const RealmSelect = Select.ofType<Realm>();
    const handleRealmSelect = async (realm: Realm) => {
        await onSelect(realm);
    }
    return (
        <RealmSelect
            className="realm-picker"
            onItemSelect={handleRealmSelect}
            filterable={realms.length > 6}
            items={realms.filter((r) => r.enabled)}
            activeItem={selected}
            itemRenderer={(realm: Realm) => <MenuItem key={realm.id} text={realm.name} onClick={() => handleRealmSelect(realm)}/>}
            noResults={<MenuItem disabled={true} text="No results." />}
        >
            {/* children become the popover target; render value here */}
            <Button
                className="realm-picker__button"
                loading={loading}
                text={selected ? selected.name : 'Select Realm'}
                rightIcon={IconNames.DOUBLE_CARET_VERTICAL}
            />
        </RealmSelect>
    );
}

export default Picker;
