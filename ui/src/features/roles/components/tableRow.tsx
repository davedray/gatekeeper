import React, {useEffect, useState} from 'react';
import {
    Button,
    Intent,
    Popover,
    EditableText,
    Classes,
    H5, ButtonGroup
} from "@blueprintjs/core";
import './tableRow.scss';
import {Role} from "../../../types";
import UserDrawer from "../containers/userDrawer";
interface props {
    role: Role,
    onUpdateName: (name: string) => Promise<any>;
    onUpdateDescription: (description: string) => Promise<any>;
    onDelete: () => Promise<any>;
    error: string|null;
}

function TableRow({role, error, ...actions}: props) {
    const [updating, setUpdating] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [popoverOpen, setPopoverOpen] = useState(false);
    const [name, setName] = useState(role.name);
    const [description, setDescription] = useState(role.description);
    const [userDrawerOpen, setUserDrawerOpen] = useState(false);

    const onUpdateName = async () => {
        if (name === role.name) return;
        setUpdating(true);
        await actions.onUpdateName(name);
        setUpdating(false);
    };

    const onUpdateDescription = async () => {
        if (description === role.description) return;
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
            setName(role.name);
            setDescription(role.description);
        }
    }, [error, role.name, role.description]);
    return (
        <tr>
            <td>
                <EditableText className={updating ? 'bp3-skeleton' : ''} disabled={updating} value={name} onCancel={() => setName(role.name)} onChange={setName} onConfirm={onUpdateName}/>
                <br/>
                <span className="bp3-text-small bp3-text-muted">
                    <EditableText className={updating ? 'bp3-skeleton' : ''} disabled={updating} value={description} onCancel={() => setDescription(role.description)} onChange={setDescription} onConfirm={onUpdateDescription}/>
                </span>
            </td>
            <td>
                <ButtonGroup>
                    <Button intent={Intent.NONE} text="View Users" icon="user" onClick={() => setUserDrawerOpen(true)}/>
                    <Popover
                        canEscapeKeyClose
                        onClose={() => setPopoverOpen(false)}
                        content={ <div className="role_TableRow__popover">
                            <H5>Confirm deletion</H5>
                            <p>Are you sure you want to delete this role? You won't be able to recover it.</p>
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
                            intent={Intent.DANGER}
                            icon={'delete'}
                            text={'Delete'}
                        />
                    </Popover>
                </ButtonGroup>
                <UserDrawer
                    isOpen={userDrawerOpen}
                    onClose={() => setUserDrawerOpen(false)}
                    title={name}
                    role={role}
                />
            </td>
        </tr>
    );
}

export default TableRow;
