import React, {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux'
import {RootState} from '../../app/rootReducer'
import {fetchUsers} from '../../app/usersList/usersListSlice';

import {Callout, Card, H3, Intent, NonIdealState,} from "@blueprintjs/core";
import Picker from "../../features/realms/containers/picker";
import './styles.scss';
import Table from "../../features/users/components/table";
import {User} from "../../types";
import ConnectedCreateForm from "../../features/users/containers/createForm";

function Users() {
    const dispatch = useDispatch();
    const selectedRealm = useSelector((state: RootState) => {
        const id = state.realmsList.selectedRealmId;
        const selectedRealm = id ? state.realmsList.realmsById[id] : null;
        return selectedRealm;
    });
    let users: User[] = [];
    let isLoading: boolean = false;
    ({ usersByRealmId: { [selectedRealm?.id || '']: users }, isLoading: { [selectedRealm?.id || '']: isLoading} } = useSelector((state: RootState) => state.usersList));
    if (!users) {
        users = [];
    }
    const hasUsers = users.length > 0;
    useEffect(() => {
        if (selectedRealm && !hasUsers && !isLoading) {
            dispatch(fetchUsers(selectedRealm))
        }
    }, [dispatch, selectedRealm, hasUsers])
  return (
    <div>
      <Callout intent={Intent.PRIMARY}>
          <H3>Users</H3>
          <p>Users are entities that are able to log into your system. They can have attributes associated with themselves like email, username, address, phone number, and birth day. They can be assigned group membership and have specific roles assigned to them.</p>
      </Callout>
      <Picker/>
      { selectedRealm && (
      <Card>
        <ConnectedCreateForm/>
      </Card>)}
      <Card className={isLoading ? 'bp3-skeleton' : ''}>
          {!users || users.length === 0 ? (
          <NonIdealState
              icon="user"
              title="No Users Exist"
              description="Create a user to populate this list"
          />
          ) : (
          <Table users={users || []}/>
          )}
      </Card>
    </div>
  );
}

export default Users;
