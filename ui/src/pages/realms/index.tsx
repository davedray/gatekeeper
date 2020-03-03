import React, { useContext, useEffect } from 'react';
import {
	Callout,
    Card,
	H3,
	Intent,
	NonIdealState,
} from "@blueprintjs/core";
import Table from "../../components/realms/table";
import CreateForm from "../../components/realms/createForm";
import { store, actions } from '../../store';

import './styles.scss';

function Realms() {
	const state = useContext(store);
	useEffect(() => {
		console.log('Pages::Realms::Fetch');
		actions.fetchRealms()
	}, [])
  	return (
  	<div>
	  	<Callout intent={Intent.PRIMARY}>
		  	<H3>Realms</H3>
		  	<p>A realm manages a set of users, credentials, roles, and groups. A user belongs to and logs into a
			  realm. Realms are isolated from one another and can only manage and authenticate the users that
			  they control.</p>
	  	</Callout>
	  	<Card>
			<CreateForm />
	  	</Card>
		{state.realms.length === 0 ? (
	  	<Card>
	  		<NonIdealState
		    	icon="globe-network"
            	title="No Realms Exist"
				description="Create a realm to populate this list"
			/>
	  	</Card>
		) : (
			<Card><Table realms={state.realms}/></Card>
		)}
  	</div>
  );
}

export default Realms;
