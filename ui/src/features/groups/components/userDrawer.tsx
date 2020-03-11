import React from 'react';
import {
    Drawer, NonIdealState,
} from "@blueprintjs/core";
import {Group, User} from "../../../types";
import ConnectedUserTable from "../containers/userTable";
import ConnectedPicker from "../../users/containers/picker";
interface props {
    isOpen: boolean;
    onClose: () => any;
    title: string;
    isLoading: boolean;
    group: Group;
    userIds: string[];
    onAddUser: (user: User) => Promise<any>;
}
function UserDrawer({isOpen, onClose, title, group, isLoading, userIds, onAddUser}: props) {
    return (
        <Drawer
            className={isLoading ? 'bp3-skeleton' : ''}
            isOpen={isOpen}
            onClose={onClose}
            icon={'people'}
            title={title}
        >
            {userIds.length > 0 ? (
                <>
                    <ConnectedUserTable userIds={userIds} group={group}/>
                    <div style={{padding: '0 10px'}}>
                        {isOpen ? <ConnectedPicker onSelect={onAddUser} filterIds={userIds} title="Add User"/> : ''}
                    </div>

                </>
            ) : (
                <NonIdealState
                    icon="user"
                    title="No Users Exist"
                    description="Add a user to this group to populate this list"
                    action={<ConnectedPicker onSelect={onAddUser} title="Add User"/>}
                />
            )}
        </Drawer>
    );
}

export default UserDrawer;
