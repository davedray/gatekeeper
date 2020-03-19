import React, {useMemo} from 'react';
import { Button, MenuItem } from "@blueprintjs/core";
import { IconNames } from "@blueprintjs/icons";
import { Select } from "@blueprintjs/select";
import './picker.scss';
import {Permission} from "../../../types";

interface props {
    permissions: Permission[];
    loading: boolean;
    selected?: string|null;
    onSelect: (permission: Permission) => Promise<any>;
    title?: string;
}

function Picker({permissions, loading, selected, onSelect, title='Select Permission'}: props) {
    const PermissionSelect = Select.ofType<Permission>();
    const handleSelect = async (permission: Permission) => {
        await onSelect(permission);
    };
    const selectedPermission = useMemo(() => permissions.find((r) => r.id === selected), [permissions, selected]);
    return (
        <PermissionSelect
            className="realm-picker"
            onItemSelect={handleSelect}
            filterable={permissions.length > 6}
            items={permissions}
            activeItem={selectedPermission}
            itemRenderer={(permission: Permission) => <MenuItem key={permission.id} text={permission.name} onClick={() => handleSelect(permission)}/>}
            noResults={<MenuItem disabled={true} text="No results." />}
        >
            {/* children become the popover target; render value here */}
            <Button
                className="permission-picker__button"
                loading={loading}
                text={selectedPermission ? selectedPermission.name : title}
                rightIcon={IconNames.DOUBLE_CARET_VERTICAL}
            />
        </PermissionSelect>
    );
}

export default Picker;
