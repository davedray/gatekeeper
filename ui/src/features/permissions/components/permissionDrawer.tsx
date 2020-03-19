import React, {useState} from 'react';
import {Permission} from "../../../types";
import RelatedDrawer from '../../relatedDrawer/component';
import {Button, Classes, H5, HTMLTable, Intent, NonIdealState, Popover, PopoverPosition} from "@blueprintjs/core";
import PermissionPicker from "../containers/picker";
interface props {
    emptyStateDescription?: string;
    isLoading: boolean;
    isOpen: boolean;
    onAddPermission: (permission: Permission) => Promise<any>;
    onDeletePermission: (permission: Permission) => Promise<any>;
    selectedPermissionIds: string[];
    onClose: () => any;
    title?: string;
    permissions: Permission[];
}
function PermissionDrawer({
    emptyStateDescription,
    isLoading,
    isOpen,
    onAddPermission,
    onClose,
    onDeletePermission,
    permissions,
    title,
    selectedPermissionIds
}: props) {
    const [isDeleting, setIsDeleting] = useState<string|false>(false);
    const [popoverOpen, setPopoverOpen] = useState<string|false>(false);
    const handleDelete = async (permission: Permission) => {
        setPopoverOpen(false);
        setIsDeleting(permission.id);
        await onDeletePermission(permission);
        setIsDeleting(false);
    };
    return (
        <RelatedDrawer
            emptyState={<NonIdealState
                icon="people"
                title="No Permissions Exist"
                description={emptyStateDescription}
                action={<PermissionPicker onSelect={onAddPermission}/>}
            />}
            hasChildren={!!selectedPermissionIds.length}
            icon="people"
            title={title || "Permissions"}
            isLoading={isLoading}
            isOpen={isOpen}
            onClose={onClose}
        >
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
                {permissions.map((permission) => (
                    <tr key={permission.id}>
                        <td>
                            {permission.name}<br/>
                            <span className="bp3-text-small bp3-text-muted">
                                {permission.description}
                            </span>
                        </td>
                        <td>
                            <Popover
                                position={PopoverPosition.LEFT}
                                content={ <div className="TableRow__popover">
                                    <H5>Confirm deletion</H5>
                                    <p>Are you sure you want to remove this permission from the permission?</p>
                                    <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 15 }}>
                                        <Button onClick={() => setPopoverOpen(permission.id)} className={Classes.POPOVER_DISMISS} style={{ marginRight: 10 }}>
                                            Cancel
                                        </Button>
                                        <Button onClick={() => handleDelete(permission)} intent={Intent.DANGER} className={Classes.POPOVER_DISMISS}>
                                            Delete
                                        </Button>
                                    </div>
                                </div>}

                                isOpen={popoverOpen === permission.id}
                            >
                                <Button
                                    loading={isDeleting === permission.id}
                                    onClick={() => setPopoverOpen(permission.id)}
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
            <div style={{padding: '0 10px'}}>
                <PermissionPicker onSelect={onAddPermission} filterIds={selectedPermissionIds}/>
            </div>
        </RelatedDrawer>
    );
}

export default PermissionDrawer;
