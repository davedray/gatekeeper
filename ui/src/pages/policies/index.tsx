import React from 'react';
import {
	Callout,
	Intent,
	H3,
} from "@blueprintjs/core";
 

import './styles.scss';

function Policies() {
  return (
  <Callout intent={Intent.PRIMARY}>
      <H3>Policies</H3>
      <p>Policies define the conditions that must be satisfied before granting access to an object.</p>
  </Callout>
  );
}

export default Policies;
