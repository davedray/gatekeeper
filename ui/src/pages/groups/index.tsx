import React, {useEffect} from 'react';
import {
    Callout,
    Card,
    Intent,
    H3, NonIdealState,
} from "@blueprintjs/core";
import Picker from "../../features/realms/containers/picker";
import CreateForm from '../../features/groups/containers/createForm';
import './styles.scss';
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../app/rootReducer";
import {Group} from "../../types";
import {fetchGroups} from "../../app/groupsList/groupsListSlice";
import Table from "../../features/groups/components/table";

function Groups() {
    const dispatch = useDispatch();
    const selectedRealm = useSelector((state: RootState) => {
        const id = state.realmsList.selectedRealmId;
        const selectedRealm = id ? state.realmsList.realmsById[id] : null;
        return selectedRealm;
    });
    let groups: Group[] = [];
    let isLoading: boolean = false;
    ({ groupsByRealmId: { [selectedRealm?.id || '']: groups }, isLoading: { [selectedRealm?.id || '']: isLoading} } = useSelector((state: RootState) => state.groupsList));
    if (!groups) {
        groups = [];
    }
    const hasGroups = groups.length > 0;
    useEffect(() => {
        if (selectedRealm && !hasGroups) {
            dispatch(fetchGroups(selectedRealm))
        }
    }, [dispatch, selectedRealm, hasGroups])
  return (
      <div>
          <Callout intent={Intent.PRIMARY}>
              <H3>Groups</H3>
              <p>Groups manage groups of users. Attributes can be defined for a group. You can map roles to a group as well. Users that become members of a group inherit the attributes and role mappings that group defines.</p>
          </Callout>
          <Picker/>
          {selectedRealm && (
          <Card>
              <CreateForm/>
          </Card>
          )}
          <Card className={isLoading ? 'bp3-skeleton' : ''}>
              {!groups || groups.length === 0 ? (
                  <NonIdealState
                      icon="people"
                      title="No Groups Exist"
                      description="Create a group to populate this list"
                  />
              ) : (
                  <Table groups={groups || []}/>
              )}
          </Card>
      </div>
  );
}

export default Groups;
