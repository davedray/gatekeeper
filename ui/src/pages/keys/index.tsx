import React from 'react';
import {
	Callout,
	Intent,
	H3,
} from "@blueprintjs/core";
 

import './styles.scss';

function Keys() {
  return (
  <Callout intent={Intent.PRIMARY}>
      <H3>Keys</H3>
      <p>
          API keys provide
          <ul>
              <li>Project identification — Identify the application or the project that's making a call to this API</li>
              <li>Project authorization — Check whether the calling application has been granted access to call the API</li>
          </ul>
          They may be granted permissions, but may not belong to groups or roles.
      </p>
  </Callout>
  );
}

export default Keys;
