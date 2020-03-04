import React, {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux'
import {RootState} from '../../app/rootReducer'
import {fetchRealms, updateRealm, deleteRealm} from '../../app/realmsList/realmsListSlice';

import {Callout, Card, H3, Intent, NonIdealState,} from "@blueprintjs/core";

import Table from "../../features/realms/components/table";
import CreateForm from "../../features/realms/containers/createForm";
import './styles.scss';

function Realms() {
	const dispatch = useDispatch();
	const { realms, isLoading } = useSelector((state: RootState) => state.realmsList);
	useEffect(() => {
		if (realms.length === 0) {
			dispatch(fetchRealms())
		}
	}, [dispatch, realms.length])
  	return (
  	<div>
	  	<Callout intent={Intent.PRIMARY}>
		  	<H3>Realms</H3>
		  	<p>A realm manages a set of users, credentials, roles, and groups. A user belongs to and logs into a
			realm. Realms are isolated from one another and can only manage and authenticate the users that they control.</p>
	  	</Callout>
	  	<Card>
			<CreateForm />
	  	</Card>
		<Card className={isLoading ? 'bp3-skeleton' : ''}>
			{realms.length === 0 ? (
	  		<NonIdealState
		    	icon="globe-network"
            	title="No Realms Exist"
				description="Create a realm to populate this list"
			/>
		) : (
			<Table
				realms={realms}
				onUpdateRealm={async (realm) => dispatch(updateRealm(realm))}
				onDeleteRealm={async (realm) => dispatch(deleteRealm(realm))}
			/>
		)}
		</Card>
  	</div>
  );
}

export default Realms;
