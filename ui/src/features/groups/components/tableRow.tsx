import React, {useEffect, useState} from 'react';
import {
    Button,
    Intent,
    Popover,
    EditableText,
    Classes,
    H5
} from "@blueprintjs/core";
import './tableRow.scss';
import {Group} from "../../../types";
interface props {
    group: Group,
    onUpdateName: (name: string) => Promise<any>;
    onUpdateDescription: (description: string) => Promise<any>;
    onDelete: () => Promise<any>;
    error: string|null;
}

function TableRow({group, error, ...actions}: props) {
    const [updating, setUpdating] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [popoverOpen, setPopoverOpen] = useState(false);
    const [name, setName] = useState(group.name);
    const [description, setDescription] = useState(group.description);

    const onUpdateName = async () => {
        if (name === group.name) return;
        setUpdating(true);
        await actions.onUpdateName(name);
        setUpdating(false);
    };

    const onUpdateDescription = async () => {
        if (description === group.description) return;
        setUpdating(true);
        await actions.onUpdateDescription(description);
        setUpdating(false);
    };

    const handleDelete = async () => {
        setDeleting(true);
        await actions.onDelete();
        setDeleting(false);
    };

    useEffect(() => {
        if (error) {
            setName(group.name);
            setDescription(group.description);
        }
    }, [error, group.name, group.description]);
    return (
        <tr>
            <td>
                <EditableText className={updating ? 'bp3-skeleton' : ''} disabled={updating} value={name} onCancel={() => setName(group.name)} onChange={setName} onConfirm={onUpdateName}/>
                <br/>
                <span className="bp3-text-small bp3-text-muted">
                    <EditableText className={updating ? 'bp3-skeleton' : ''} disabled={updating} value={description} onCancel={() => setDescription(group.description)} onChange={setDescription} onConfirm={onUpdateDescription}/>
                </span>
            </td>
            <td>
                <Popover
                    canEscapeKeyClose
                    onClose={() => setPopoverOpen(false)}
                    content={ <div className="group_TableRow__popover">
                        <H5>Confirm deletion</H5>
                        <p>Are you sure you want to delete this group? You won't be able to recover it.</p>
                        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 15 }}>
                            <Button onClick={() => setPopoverOpen(!popoverOpen)} className={Classes.POPOVER_DISMISS} style={{ marginRight: 10 }}>
                                Cancel
                            </Button>
                            <Button onClick={handleDelete} intent={Intent.DANGER} className={Classes.POPOVER_DISMISS}>
                                Delete
                            </Button>
                        </div>
                    </div>}

                    isOpen={popoverOpen}
                >
                    <Button
                        loading={deleting}
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
    );
}

export default TableRow;
