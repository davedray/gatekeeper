import React, {useEffect, useState} from 'react';
import {
    Button,
    Intent,
    Popover,
    Classes,
    H5
} from "@blueprintjs/core";

import {User} from "../../../types";

interface props {
    user: User;
    onDelete: () => Promise<any>;
    error: string|null;
}

function TableRow({user, onDelete, error}: props) {
    const [deleting, setDeleting] = useState(false);
    const [popoverOpen, setPopoverOpen] = useState(false);

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
                <Popover
                    content={ <div className="TableRow__popover">
                        <H5>Confirm deletion</H5>
                        <p>Are you sure you want to remove this user from the group?</p>
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
