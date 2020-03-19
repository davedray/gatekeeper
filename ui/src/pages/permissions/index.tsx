import React, {useEffect} from 'react';
import {
    Callout,
    Card,
    Intent,
    H3, NonIdealState,
} from "@blueprintjs/core";
import Picker from "../../features/realms/containers/picker";
import CreateForm from '../../features/permissions/containers/createForm';
import './styles.scss';
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../app/rootReducer";
import {Permission} from "../../types";
import {fetchPermissions} from "../../app/permissionsList/permissionsListSlice";
import Table from "../../features/permissions/components/table";

function Permissions() {
    const dispatch = useDispatch();
    const selectedRealm = useSelector((state: RootState) => {
        const id = state.realmsList.selectedRealmId;
        const selectedRealm = id ? state.realmsList.realmsById[id] : null;
        return selectedRealm;
    });

    const isLoading: boolean = useSelector((state: RootState) => state.permissionsList.isLoading[selectedRealm ? selectedRealm.id : ''] || false);
    const isLoaded: boolean = useSelector((state: RootState) => state.permissionsList.isLoaded[selectedRealm ? selectedRealm.id : ''] || false);
    const error: boolean = useSelector((state: RootState) => !!state.permissionsList.error);
    const permissions: Permission[] = useSelector((state: RootState) => state.permissionsList.permissionsByRealmId[selectedRealm ? selectedRealm.id : ''] || []);
    useEffect(() => {
        if (!error && !isLoaded && !isLoading && selectedRealm) {
            dispatch(fetchPermissions(selectedRealm))
        }
    }, [dispatch, selectedRealm, isLoaded, isLoading, error]);
    return (
        <div>
            <Callout intent={Intent.PRIMARY}>
                <H3>Permissions</H3>
                <p>A permission associates the object being protected and the policies that must be evaluated to decide whether access should be granted.</p>
            </Callout>
            <Picker/>
            {selectedRealm && (
                <Card>
                    <CreateForm/>
                </Card>
            )}
            <Card className={isLoading ? 'bp3-skeleton' : ''}>
                {!permissions || permissions.length === 0 ? (
                    <NonIdealState
                        icon={selectedRealm ? "layer" : 'globe-network'}
                        title={selectedRealm ? "No Permissions Exist" : 'Realm Not Selected'}
                        description={selectedRealm ? "Create a permission to populate this list" : 'Select a realm to populate this list'}
                    />
                ) : (
                    <Table permissions={permissions || []}/>
                )}
            </Card>
        </div>
    );
}

export default Permissions;
