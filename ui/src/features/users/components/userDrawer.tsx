import React, {useState} from 'react';
import {User} from "../../../types";
import RelatedDrawer from '../../relatedDrawer/component';
import {Button, Classes, H5, HTMLTable, Intent, NonIdealState, Popover, PopoverPosition} from "@blueprintjs/core";
import UserPicker from "../../users/containers/picker";
interface props {
    emptyStateDescription?: string;
    isLoading: boolean;
    isOpen: boolean;
    onAddUser: (user: User) => Promise<any>;
    onDeleteUser: (user: User) => Promise<any>;
    selectedUserIds: string[];
    onClose: () => any;
    title?: string;
    users: User[];
}
function UserDrawer({
    emptyStateDescription,
    isLoading,
    isOpen,
    onAddUser,
    onClose,
    onDeleteUser,
    users,
    selectedUserIds,
    title
}: props) {
    const [isDeleting, setIsDeleting] = useState(false);
    const [popoverOpen, setPopoverOpen] = useState<false|string>(false);
    const handleDelete = async (user: User) => {
        setPopoverOpen(user.id);
        setIsDeleting(true);
        await onDeleteUser(user);
        setIsDeleting(false);
        setPopoverOpen(false);
    };
    return (
        <RelatedDrawer
            emptyState={<NonIdealState
                icon="person"
                title="No Users Exist"
                description={emptyStateDescription}
                action={<UserPicker onSelect={onAddUser}/>}
            />}
            hasChildren={!!selectedUserIds.length}
            icon="person"
            title={title || "Users"}
            isLoading={isLoading}
            isOpen={isOpen}
            onClose={onClose}
        >
            <HTMLTable
                bordered
                interactive={true}
                style={{width: '100%'}}
            >
                <thead>
                <tr>
                    <td>Username</td>
                    <td>Actions</td>
                </tr>
                </thead>
                <tbody>
                {users.map((user) => (
                    <tr key={user.id}>
                        <td>
                            {user.username}<br/>
                            { user.suspendedUntil ? (
                                <span className="bp3-text-small bp3-text-muted">
                                    Suspended Until {new Intl.DateTimeFormat('en-US').format(new Date(user.suspendedUntil!))}
                                </span>
                            ) : ''}
                            { user.banned ? (
                                <span className="bp3-text-small bp3-text-muted">
                                    Banned
                                </span>
                            ) : ''}
                        </td>
                        <td>
                            <Popover
                                position={PopoverPosition.LEFT}
                                content={ <div className="TableRow__popover">
                                    <H5>Confirm deletion</H5>
                                    <p>Are you sure you want to remove this user?</p>
                                    <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 15 }}>
                                        <Button onClick={() => setPopoverOpen(false)} className={Classes.POPOVER_DISMISS} style={{ marginRight: 10 }}>
                                            Cancel
                                        </Button>
                                        <Button onClick={() => handleDelete(user)} intent={Intent.DANGER} className={Classes.POPOVER_DISMISS}>
                                            Delete
                                        </Button>
                                    </div>
                                </div>}
                                onClose={() => setPopoverOpen(false)}
                                isOpen={popoverOpen === user.id}
                            >
                                <Button
                                    loading={isDeleting}
                                    onClick={() => setPopoverOpen(user.id)}
                                    minimal
                                    outlined={"true" as any}
                                    intent={Intent.DANGER}
                                    icon={'delete'}
                                    text={'Delete'}
                                />
                            </Popover>
                        </td>
                    </tr>
                ))}
                </tbody>
                <tfoot>
                    <tr>
                        <td colSpan={2}>
                            <UserPicker onSelect={onAddUser} filterIds={selectedUserIds}/>
                        </td>
                    </tr>
                </tfoot>
            </HTMLTable>
        </RelatedDrawer>
    );
}

export default UserDrawer;
