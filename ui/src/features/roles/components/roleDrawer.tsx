import React, {useState} from 'react';
import {Role} from "../../../types";
import RelatedDrawer from '../../relatedDrawer/component';
import {Button, Classes, H5, HTMLTable, Intent, NonIdealState, Popover, PopoverPosition} from "@blueprintjs/core";
import RolePicker from "../containers/picker";
interface props {
    emptyStateDescription?: string;
    isLoading: boolean;
    isOpen: boolean;
    onAddRole: (role: Role) => Promise<any>;
    onDeleteRole: (role: Role) => Promise<any>;
    selectedRoleIds: string[];
    onClose: () => any;
    title?: string;
    roles: Role[];
}
function RoleDrawer({
    emptyStateDescription,
    isLoading,
    isOpen,
    onAddRole,
    onClose,
    onDeleteRole,
    roles,
    title,
    selectedRoleIds
}: props) {
    const [isDeleting, setIsDeleting] = useState(false);
    const [popoverOpen, setPopoverOpen] = useState(false);
    const handleDelete = async (role: Role) => {
        setPopoverOpen(false);
        setIsDeleting(true);
        await onDeleteRole(role);
        setIsDeleting(false);
    };
    return (
        <RelatedDrawer
            emptyState={<NonIdealState
                icon="layers"
                title="No Roles Exist"
                description={emptyStateDescription}
                action={<RolePicker onSelect={onAddRole}/>}
            />}
            hasChildren={!!selectedRoleIds.length}
            icon="layers"
            title={title || "Roles"}
            isLoading={isLoading}
            isOpen={isOpen}
            onClose={onClose}
        >
            {!isLoading &&
            <HTMLTable
                bordered
                style={{width: '100%'}}
            >
                <thead>
                <tr>
                    <td>Name</td>
                    <td>Actions</td>
                </tr>
                </thead>
                <tbody>
                {roles.map((role) => (
                    <tr key={role.id}>
                        <td>
                            {role.name}<br/>
                            <span className="bp3-text-small bp3-text-muted">
                                {role.description}
                            </span>
                        </td>
                        <td>
                            <Popover
                                position={PopoverPosition.LEFT}
                                content={<div className="TableRow__popover">
                                    <H5>Confirm deletion</H5>
                                    <p>Are you sure you want to remove this role from the group?</p>
                                    <div style={{display: "flex", justifyContent: "flex-end", marginTop: 15}}>
                                        <Button onClick={() => setPopoverOpen(!popoverOpen)}
                                                className={Classes.POPOVER_DISMISS} style={{marginRight: 10}}>
                                            Cancel
                                        </Button>
                                        <Button onClick={() => handleDelete(role)} intent={Intent.DANGER}
                                                className={Classes.POPOVER_DISMISS}>
                                            Delete
                                        </Button>
                                    </div>
                                </div>}

                                isOpen={popoverOpen}
                            >
                                <Button
                                    loading={isDeleting}
                                    onClick={() => setPopoverOpen(!popoverOpen)}
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
            </HTMLTable>
            }
            <div style={{padding: '0 10px'}}>
                <RolePicker onSelect={onAddRole} filterIds={selectedRoleIds}/>
            </div>
        </RelatedDrawer>
    );
}

export default RoleDrawer;
