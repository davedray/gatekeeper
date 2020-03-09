import React from 'react';
import TableRow from '../components/tableRow';
import {useDispatch, useSelector} from 'react-redux'
import {Group} from "../../../types";
import {deleteGroup, updateGroup} from "../../../app/groupsList/groupsListSlice";
import {RootState} from "../../../app/rootReducer";
interface props {
    group: Group;
}
function ConnectedTableRow({group}: props) {
    const error = useSelector((state: RootState) => state.groupsList.error);
    const dispatch = useDispatch();
    const onUpdateName = async (name: string) => {
        return dispatch(updateGroup({id: group.id, realmId: group.realmId, name}));
    };
    const onUpdateDescription = async (description: string) => {
        return dispatch(updateGroup({id: group.id, realmId: group.realmId, description}));
    };
    const onDelete = async() => {
        return dispatch(deleteGroup(group));
    }
    return (
        <TableRow group={group} onUpdateName={onUpdateName} onUpdateDescription={onUpdateDescription} onDelete={onDelete} error={error}/>
    );
}

export default ConnectedTableRow;
