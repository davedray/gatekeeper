import React, {useState} from 'react';
import {Group} from "../../../types";
import RelatedDrawer from '../../relatedDrawer/component';
import {Button, Classes, H5, HTMLTable, Intent, NonIdealState, Popover, PopoverPosition} from "@blueprintjs/core";
import GroupPicker from "../containers/picker";
interface props {
    emptyStateDescription?: string;
    isLoading: boolean;
    isOpen: boolean;
    onAddGroup: (group: Group) => Promise<any>;
    onDeleteGroup: (group: Group) => Promise<any>;
    selectedGroupIds: string[];
    onClose: () => any;
    title?: string;
    groups: Group[];
}
function GroupDrawer({
    emptyStateDescription,
    isLoading,
    isOpen,
    onAddGroup,
    onClose,
    onDeleteGroup,
    groups,
    title,
    selectedGroupIds
}: props) {
    const [isDeleting, setIsDeleting] = useState<string|false>(false);
    const [popoverOpen, setPopoverOpen] = useState<string|false>(false);
    const handleDelete = async (group: Group) => {
        setPopoverOpen(false);
        setIsDeleting(group.id);
        await onDeleteGroup(group);
        setIsDeleting(false);
    };
    return (
        <RelatedDrawer
            emptyState={<NonIdealState
                icon="people"
                title="No Groups Exist"
                description={emptyStateDescription}
                action={<GroupPicker onSelect={onAddGroup}/>}
            />}
            hasChildren={!!selectedGroupIds.length}
            icon="people"
            title={title || "Groups"}
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
                {groups.map((group) => (
                    <tr key={group.id}>
                        <td>
                            {group.name}<br/>
                            <span className="bp3-text-small bp3-text-muted">
                                {group.description}
                            </span>
                        </td>
                        <td>
                            <Popover
                                position={PopoverPosition.LEFT}
                                content={ <div className="TableRow__popover">
                                    <H5>Confirm deletion</H5>
                                    <p>Are you sure you want to remove this group from the group?</p>
                                    <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 15 }}>
                                        <Button onClick={() => setPopoverOpen(group.id)} className={Classes.POPOVER_DISMISS} style={{ marginRight: 10 }}>
                                            Cancel
                                        </Button>
                                        <Button onClick={() => handleDelete(group)} intent={Intent.DANGER} className={Classes.POPOVER_DISMISS}>
                                            Delete
                                        </Button>
                                    </div>
                                </div>}

                                isOpen={popoverOpen === group.id}
                            >
                                <Button
                                    loading={isDeleting === group.id}
                                    onClick={() => setPopoverOpen(group.id)}
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
                <GroupPicker onSelect={onAddGroup} filterIds={selectedGroupIds}/>
            </div>
        </RelatedDrawer>
    );
}

export default GroupDrawer;
