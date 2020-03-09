import React, {useMemo} from 'react';
import { Button, MenuItem } from "@blueprintjs/core";
import { IconNames } from "@blueprintjs/icons";
import { Select } from "@blueprintjs/select";
import './picker.scss';
import {User} from "../../../types";

interface props {
    users: User[];
    loading: boolean;
    selected: string|null;
    onSelect: (user: User) => Promise<any>;
}

function Picker({users, loading, selected, onSelect}: props) {
    const UserSelect = Select.ofType<User>();
    const handleSelect = async (user: User) => {
        await onSelect(user);
    };
    const selectedUser = useMemo(() => users.find((r) => r.id === selected), [users, selected]);
    return (
        <UserSelect
            className="realm-picker"
            onItemSelect={handleSelect}
            filterable={users.length > 6}
            items={users.filter((r) => !r.banned)}
            activeItem={selectedUser}
            itemRenderer={(user: User) => <MenuItem key={user.id} text={user.username} onClick={() => handleSelect(user)}/>}
            noResults={<MenuItem disabled={true} text="No results." />}
        >
            {/* children become the popover target; render value here */}
            <Button
                className="user-picker__button"
                loading={loading}
                text={selectedUser ? selectedUser.username : 'Select User'}
                rightIcon={IconNames.DOUBLE_CARET_VERTICAL}
            />
        </UserSelect>
    );
}

export default Picker;
