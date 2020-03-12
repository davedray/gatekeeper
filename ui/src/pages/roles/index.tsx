import React, {useEffect} from 'react';
import {
    Callout,
    Card,
    Intent,
    H3, NonIdealState,
} from "@blueprintjs/core";
import Picker from "../../features/realms/containers/picker";
import CreateForm from '../../features/roles/containers/createForm';
import './styles.scss';
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../app/rootReducer";
import {Role} from "../../types";
import {fetchRoles} from "../../app/rolesList/rolesListSlice";
import Table from "../../features/roles/components/table";

function Roles() {
    const dispatch = useDispatch();
    const selectedRealm = useSelector((state: RootState) => {
        const id = state.realmsList.selectedRealmId;
        const selectedRealm = id ? state.realmsList.realmsById[id] : null;
        return selectedRealm;
    });
    let roles: Role[] = [];
    let isLoading: boolean = false;
    ({ rolesByRealmId: { [selectedRealm?.id || '']: roles }, isLoading: { [selectedRealm?.id || '']: isLoading} } = useSelector((state: RootState) => state.rolesList));
    if (!roles) {
        roles = [];
    }
    const hasRoles = roles.length > 0;
    useEffect(() => {
        if (selectedRealm && !hasRoles) {
            dispatch(fetchRoles(selectedRealm))
        }
    }, [dispatch, selectedRealm, hasRoles])
    return (
        <div>
            <Callout intent={Intent.PRIMARY}>
                <H3>Roles</H3>
                <p>Roles manage roles of users. Attributes can be defined for a role. You can map roles to a role as well. Users that become members of a role inherit the attributes and role mappings that role defines.</p>
            </Callout>
            <Picker/>
            {selectedRealm && (
                <Card>
                    <CreateForm/>
                </Card>
            )}
            <Card className={isLoading ? 'bp3-skeleton' : ''}>
                {!roles || roles.length === 0 ? (
                    <NonIdealState
                        icon={selectedRealm ? "layers" : 'globe-network'}
                        title={selectedRealm ? "No Roles Exist" : 'Realm Not Selected'}
                        description={selectedRealm ? "Create a role to populate this list" : 'Select a realm to populate this list'}
                    />
                ) : (
                    <Table roles={roles || []}/>
                )}
            </Card>
        </div>
    );
}

export default Roles;
