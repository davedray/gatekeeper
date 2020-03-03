import React, { useState } from 'react';
import {
    Switch,
    Spinner,
    Button,
    Intent,
    Popover,
    Toaster, Classes, H5
} from "@blueprintjs/core";
import { actions, realm} from "../../store";
import './tableRow.scss';
interface props {
    realm: realm;
}
const toaster = Toaster.create({
    position: "bottom-left",
    maxToasts: 5
});

function TableRow({realm}: props) {
    const [loading, setLoading] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [popoverOpen, setPopoverOpen] = useState(false);
    const onToggle = () => {
        setLoading(true);
        actions.updateRealm({
            ...realm,
            enabled: !realm.enabled
        }).then(() => {
            toaster.show({
                message: `Realm ${!realm.enabled ? 'enabled' : 'disabled'}`,
                intent: Intent.SUCCESS,
                icon: 'tick-circle'
            })
        }).catch(() => {
            toaster.show({
                message: `Coult not ${!realm.enabled ? 'enable' : 'disable'} realm`,
                intent: Intent.DANGER
            })
        }).finally(() => setLoading(false));
    }

    const handleDelete = () => {
        setDeleting(true);
        actions.deleteRealm(realm).then(() => {
            toaster.show({
                message: 'Realm deleted',
                intent: Intent.SUCCESS,
                icon: 'tick-circle'
            })
        }).catch(() => {
            toaster.show({
                message: 'Coult not delete realm',
                intent: Intent.DANGER
            });
            setDeleting(false);
        })
    }
    return (
        <tr>
            <td>
                {realm.name}
                <br/>
                <span className="bp3-text-small bp3-text-muted">
                    {realm.description}
                </span>
            </td>
            <td>
                {loading
                    ? <span><Spinner className="TableRow__spinner" size={15}/></span>
                    : <Switch disabled={loading} checked={realm.enabled} onChange={onToggle}/>
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
