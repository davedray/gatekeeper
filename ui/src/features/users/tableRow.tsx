import React, { useState } from 'react';
import {
    Switch,
    Spinner,
    Button,
    Intent,
    Popover,
    Classes,
    H5
} from "@blueprintjs/core";
import {
    DatePicker
} from "@blueprintjs/datetime";
import './tableRow.scss';
import {User} from "../../types";
interface props {
    user: User;
}

function TableRow({user}: props) {
    const [toggling, setToggling] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [popoverOpen, setPopoverOpen] = useState(false);

    const onToggleBan = () => {
        setToggling(true);
        (new Promise((r) => r())).finally(() => setToggling(false));
    }


    const handleDelete = () => {
        setDeleting(true);
        setDeleting(false);
    };

    return (
        <tr>
            <td>
                {user.username}
            </td>
            <td>
                {toggling
                    ? <span><Spinner className="TableRow__spinner" size={15}/></span>
                    : <Switch disabled={toggling} checked={user.banned} onChange={onToggleBan}/>
                }
            </td>
            <td>
                <Popover content={<DatePicker minDate={new Date()}/>} target={<Button text="Not Suspended"/>}/>
            </td>
            <td>
                <Popover
                    content={ <div className="TableRow__popover">
                        <H5>Confirm deletion</H5>
                        <p>Are you sure you want to delete this user? You won't be able to recover them.</p>
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
