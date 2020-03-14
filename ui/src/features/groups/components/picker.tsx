import React, {useMemo} from 'react';
import { Button, MenuItem } from "@blueprintjs/core";
import { IconNames } from "@blueprintjs/icons";
import { Select } from "@blueprintjs/select";
import './picker.scss';
import {Group} from "../../../types";

interface props {
    groups: Group[];
    loading: boolean;
    selected?: string|null;
    onSelect: (group: Group) => Promise<any>;
    title?: string;
}

function Picker({groups, loading, selected, onSelect, title='Select Group'}: props) {
    const GroupSelect = Select.ofType<Group>();
    const handleSelect = async (group: Group) => {
        await onSelect(group);
    };
    const selectedGroup = useMemo(() => groups.find((r) => r.id === selected), [groups, selected]);
    return (
        <GroupSelect
            className="realm-picker"
            onItemSelect={handleSelect}
            filterable={groups.length > 6}
            items={groups}
            activeItem={selectedGroup}
            itemRenderer={(group: Group) => <MenuItem key={group.id} text={group.name} onClick={() => handleSelect(group)}/>}
            noResults={<MenuItem disabled={true} text="No results." />}
        >
            {/* children become the popover target; render value here */}
            <Button
                className="group-picker__button"
                loading={loading}
                text={selectedGroup ? selectedGroup.name : title}
                rightIcon={IconNames.DOUBLE_CARET_VERTICAL}
            />
        </GroupSelect>
    );
}

export default Picker;
