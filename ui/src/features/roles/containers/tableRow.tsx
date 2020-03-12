import React from 'react';
import TableRow from '../components/tableRow';
import {useDispatch, useSelector} from 'react-redux'
import {Role} from "../../../types";
import {deleteRole, updateRole} from "../../../app/rolesList/rolesListSlice";
import {RootState} from "../../../app/rootReducer";
interface props {
    role: Role;
}
function ConnectedTableRow({role}: props) {
    const error = useSelector((state: RootState) => state.rolesList.error);
    const dispatch = useDispatch();
    const onUpdateName = async (name: string) => {
        return dispatch(updateRole({id: role.id, realmId: role.realmId, name}));
    };
    const onUpdateDescription = async (description: string) => {
        return dispatch(updateRole({id: role.id, realmId: role.realmId, description}));
    };
    const onDelete = async() => {
        return dispatch(deleteRole(role));
    }
    return (
        <TableRow role={role} onUpdateName={onUpdateName} onUpdateDescription={onUpdateDescription} onDelete={onDelete} error={error}/>
    );
}

export default ConnectedTableRow;
