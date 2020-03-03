import React from 'react';
import {
	Callout,
	Intent,
	H3,
} from "@blueprintjs/core";
 

import './styles.scss';

function Permissions() {
  return (
  <Callout intent={Intent.PRIMARY}>
      <H3>Permissions</H3>
      <p>A permission associates the object being protected and the policies that must be evaluated to decide whether access should be granted.</p>
  </Callout>
  );
}

export default Permissions;
