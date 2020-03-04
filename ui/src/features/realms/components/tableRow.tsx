import React, { useState } from 'react';
import {
    Switch,
    Spinner,
    Button,
    Intent,
    Popover,
    EditableText,
    Classes,
    H5
} from "@blueprintjs/core";
import './tableRow.scss';
import {Realm} from "../../../types";
interface props {
    realm: Realm;
    onUpdate: (realm: Realm) => Promise<any>;
    onDelete: (realm: Realm) => Promise<any>;
}

function TableRow({realm, ...actions}: props) {
    const [toggling, setToggling] = useState(false);
    const [updating, setUpdating] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [popoverOpen, setPopoverOpen] = useState(false);
    const [name, setName] = useState(realm.name);
    const [description, setDescription] = useState(realm.description);

    const onToggle = async () => {
        setToggling(true);
        let updated = {
            ...realm,
            enabled: !realm.enabled
        };
        await actions.onUpdate(updated);
        setToggling(false);
    };

    const onUpdateName = async () => {
        setUpdating(true);
        let updated = {
            ...realm,
            name
        };
        await actions.onUpdate(updated);
        setUpdating(false);
    };

    const onUpdateDescription = async () => {
        setUpdating(true);
        let updated = {
            ...realm,
            description
        };
        await actions.onUpdate(updated);
        setUpdating(false);
    };

    const handleDelete = async () => {
        setDeleting(true);
        await actions.onDelete(realm);
        setDeleting(false);
    };

    return (
        <tr>
            <td>
                <EditableText className={updating ? 'bp3-skeleton' : ''} disabled={updating} value={name} onCancel={() => setName(realm.name)} onChange={setName} onConfirm={onUpdateName}/>
                <br/>
                <span className="bp3-text-small bp3-text-muted">
                    <EditableText className={updating ? 'bp3-skeleton' : ''} disabled={updating} value={description} onCancel={() => setDescription(realm.description)} onChange={setDescription} onConfirm={onUpdateDescription}/>
                </span>
            </td>
            <td>
                {toggling
                    ? <span><Spinner className="TableRow__spinner" size={15}/></span>
                    : <Switch disabled={toggling} checked={realm.enabled} onChange={onToggle}/>
                }
            </td>
            <td>
                <Popover
                    content={ <div className="TableRow__popover">
                        <H5>Confirm deletion</H5>
                        <p>Are you sure you want to delete these items? You won't be able to recover them.</p>
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
