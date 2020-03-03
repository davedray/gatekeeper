import React from 'react';
import {
	Callout,
	Intent,
	H3,
} from "@blueprintjs/core";
 

import './styles.scss';

function Users() {
  return (
  <Callout intent={Intent.PRIMARY}>
      <H3>Users</H3>
      <p>Users are entities that are able to log into your system. They can have attributes associated with themselves like email, username, address, phone number, and birth day. They can be assigned group membership and have specific roles assigned to them.</p>
  </Callout>
  );
}

export default Users;
