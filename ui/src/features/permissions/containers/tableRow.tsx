import React, {useCallback} from 'react';
import TableRow from '../components/tableRow';
import {useDispatch, useSelector} from 'react-redux'
import {Permission} from "../../../types";
import {deletePermission, updatePermission} from "../../../app/permissionsList/permissionsListSlice";
import {RootState} from "../../../app/rootReducer";
interface props {
    permission: Permission;
}
function ConnectedTableRow({permission}: props) {
    const error = useSelector((state: RootState) => state.permissionsList.error);
    const dispatch = useDispatch();

    const onUpdateName = useCallback(async (name: string) => {
        return dispatch(updatePermission({id: permission.id, realmId: permission.realmId, name}));
    }, [permission, dispatch]);
    const onUpdateDescription = useCallback(async (description: string) => {
        return dispatch(updatePermission({id: permission.id, realmId: permission.realmId, description}));
    }, [permission, dispatch]);
    const onDelete = useCallback(async() => {
        return dispatch(deletePermission(permission));
    }, [permission, dispatch]);
    return (
        <TableRow
            permission={permission}
            onUpdateName={onUpdateName}
            onUpdateDescription={onUpdateDescription}
            onDelete={onDelete}
            error={error}
        />
    );
}

export default ConnectedTableRow;
