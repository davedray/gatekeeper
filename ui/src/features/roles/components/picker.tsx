import React, {useMemo} from 'react';
import { Button, MenuItem } from "@blueprintjs/core";
import { IconNames } from "@blueprintjs/icons";
import { Select } from "@blueprintjs/select";
import './picker.scss';
import {Role} from "../../../types";

interface props {
    roles: Role[];
    loading: boolean;
    selected: string|null;
    onSelect: (role: Role) => Promise<any>;
    title?: string;
}

function Picker({roles, loading, selected, onSelect, title='Select Role'}: props) {
    const RoleSelect = Select.ofType<Role>();
    const handleSelect = async (role: Role) => {
        await onSelect(role);
    };
    const selectedRole = useMemo(() => roles.find((r) => r.id === selected), [roles, selected]);
    return (
        <RoleSelect
            className="realm-picker"
            onItemSelect={handleSelect}
            filterable={roles.length > 6}
            items={roles}
            activeItem={selectedRole}
            itemRenderer={(role: Role) => <MenuItem key={role.id} text={role.name} onClick={() => handleSelect(role)}/>}
            noResults={<MenuItem disabled={true} text="No results." />}
        >
            {/* children become the popover target; render value here */}
            <Button
                className="role-picker__button"
                loading={loading}
                text={selectedRole ? selectedRole.name : title}
                rightIcon={IconNames.DOUBLE_CARET_VERTICAL}
            />
        </RoleSelect>
    );
}

export default Picker;
