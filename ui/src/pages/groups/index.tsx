import React from 'react';
import {
	Callout,
	Intent,
	H3,
} from "@blueprintjs/core";
import Picker from "../../components/realms/picker";

import './styles.scss';

function Groups() {
  return (
      <div>
          <Callout intent={Intent.PRIMARY}>
              <H3>Groups</H3>
              <p>Groups manage groups of users. Attributes can be defined for a group. You can map roles to a group as well. Users that become members of a group inherit the attributes and role mappings that group defines.</p>
          </Callout>
          <Picker/>
      </div>
  );
}

export default Groups;
