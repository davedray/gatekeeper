import React, {useEffect, useState} from 'react';
import {
    Switch,
    Spinner,
    Button,
    Intent,
    Popover,
    Classes,
    H5, ButtonGroup
} from "@blueprintjs/core";
import {
    DatePicker
} from "@blueprintjs/datetime";
import GroupDrawer from "../containers/groupDrawer";
import RoleDrawer from "../containers/roleDrawer";
import {User} from "../../../types";
import './tableRow.scss';

interface props {
    user: User;
    onBan: () => Promise<any>;
    onUnban: () => Promise<any>;
    onSuspend: (until: Date) => Promise<any>;
    onDelete: () => Promise<any>;
    error: string|null;
}

function TableRow({user, onBan, onUnban, onSuspend, onDelete, error}: props) {
    const [toggling, setToggling] = useState(false);
    const [suspending, setSuspending] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [popoverOpen, setPopoverOpen] = useState(false);
    const [datepickerOpen, setDatepickerOpen] = useState(false);
    const [groupDrawerOpen, setGroupDrawerOpen] = useState(false);
    const [roleDrawerOpen, setRoleDrawerOpen] = useState(false);

    const onToggleBan = async () => {
        setToggling(true);
        await (user.banned ? onUnban() : onBan());
        setToggling(false);
    };

    const handleSuspend = async (until: Date, isUserChange: boolean) => {
        if (!isUserChange) return;
        setSuspending(true);
        setDatepickerOpen(false);
        await onSuspend(until);
        setSuspending(false);
    }

    const handleDelete = async () => {
        setDeleting(true);
        await onDelete();
    };

    useEffect(() => {
        setDeleting(false);
    }, [error]);
    return (
        <tr>
            <td>
                {user.username}
            </td>
            <td>
                {toggling
                    ? <span><Spinner className="user_TableRow__spinner" size={15}/></span>
                    : <Switch disabled={toggling} checked={user.banned} onChange={onToggleBan}/>
                }
            </td>
            <td>
                <Popover
                    canEscapeKeyClose={true}
                    onClose={() => setDatepickerOpen(false)}
                    content={
                        <DatePicker
                            minDate={new Date()}
                            onChange={handleSuspend}
                            canClearSelection={true}
                            showActionsBar
                            defaultValue={user.suspendedUntil !== null ? new Date(user.suspendedUntil) : undefined}
                        />
                    }
                    target={
                        <Button
                            onClick={() => setDatepickerOpen(!datepickerOpen)}
                            loading={suspending}
                            text={
                                user.suspendedUntil
                                    ? new Intl.DateTimeFormat('en-US').format(new Date(user.suspendedUntil))
                                    : 'Not Suspended'
                            }
                        />}
                    isOpen={datepickerOpen}
                />
            </td>
            <td>
                <ButtonGroup>
                    <Button intent={Intent.NONE} text="View Groups" icon="people" onClick={() => setGroupDrawerOpen(true)}/>
                    <Button intent={Intent.NONE} text="View Roles" icon="layers" onClick={() => setRoleDrawerOpen(true)}/>
                    <Popover
                        content={<div className="TableRow__popover">
                            <H5>Confirm deletion</H5>
                            <p>Are you sure you want to delete this user? You won't be able to recover them.</p>
                            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 15 }}>
                                <Button onClick={() => setPopoverOpen(false)} className={Classes.POPOVER_DISMISS} style={{ marginRight: 10 }}>
                                    Cancel
                                </Button>
                                <Button onClick={handleDelete} intent={Intent.DANGER} className={Classes.POPOVER_DISMISS}>
                                    Delete
                                </Button>
                            </div>
                        </div>}
                        onClose={() => setPopoverOpen(false)}
                        isOpen={popoverOpen}
                    >
                        <Button
                            loading={deleting}
                            onClick={() => setPopoverOpen(true)}
                            minimal
                            intent={Intent.DANGER}
                            icon={'delete'}
                            text={'Delete'}
                        />
                    </Popover>
                </ButtonGroup>
                <GroupDrawer
                    isOpen={groupDrawerOpen}
                    onClose={() => setGroupDrawerOpen(false)}
                    user={user}
                    title={user.username}
                />
                <RoleDrawer
                    isOpen={roleDrawerOpen}
                    onClose={() => setRoleDrawerOpen(false)}
                    user={user}
                    title={user.username}
                />
            </td>
        </tr>
    );
}

export default TableRow;
