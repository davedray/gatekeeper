import React, {useEffect} from 'react';
import {Group, User} from "../../../types";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../../app/rootReducer";
import {fetchGroupUsers, createGroupUser} from "../../../app/groupUsers/groupUsersSlice";
import UserDrawer from '../components/userDrawer';
interface props {
    isOpen: boolean;
    onClose: () => any;
    group: Group;
    title: string;
}
function ConnectedUserDrawer({isOpen, onClose, title, group}: props) {
    const dispatch = useDispatch();
    const userIds = useSelector((state: RootState) => state.groupUsers.groupUsers[group.id] || []);
    const isLoading = useSelector((state: RootState) => state.groupUsers.isLoading[group.id] || false);
    const hasUsers = userIds.length;
    useEffect(() => {
        if (!hasUsers) {
            dispatch(fetchGroupUsers(group));
        }
    }, [dispatch, group, hasUsers]);
    const onAddUser = async (user: User) => {
        return dispatch(createGroupUser(group, user));
    }
    return (
        <UserDrawer
            isLoading={isLoading}
            isOpen={isOpen}
            onClose={onClose}
            title={title}
            group={group}
            userIds={userIds}
            onAddUser={onAddUser}
        />
    );
}

export default ConnectedUserDrawer;
