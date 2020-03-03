import React from 'react';
import {
	Callout,
	Intent,
	H3,
} from "@blueprintjs/core";
 

import './styles.scss';

function Roles() {
  return (
  <Callout intent={Intent.PRIMARY}>
      <H3>Roles</H3>
      <p>Roles identify a type or category of user. Admin, user, manager, and employee are all typical roles that may exist in an organization. Applications often assign access and permissions to specific roles rather than individual users as dealing with users can be too fine grained and hard to manage.</p>
  </Callout>
  );
}

export default Roles;
