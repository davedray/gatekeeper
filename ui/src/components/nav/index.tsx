import React from 'react';
import {
    Alignment,
    Button,
    Navbar,
} from '@blueprintjs/core';
import {
    NavLink
} from 'react-router-dom';

import './nav.scss';

function Nav() {
  return (
	<Navbar fixedToTop className="nav">
		<Navbar.Group align={Alignment.LEFT}>
			<NavLink
				to="/"
				activeClassName=""
			>
				<Navbar.Heading>Oathkeeper</Navbar.Heading>
			</NavLink>
			<Navbar.Divider />
			<NavLink
				to="/realms"
				activeClassName="active"
			>
				<Button minimal icon="globe-network" text="Realms" />
			</NavLink>
			<NavLink
				to="/groups"
				activeClassName="active"
			>
				<Button minimal icon="people" text="Groups" />
			</NavLink>
			<NavLink
				to="/users"
				activeClassName="active"
			>
				<Button minimal icon="person" text="Users" />
			</NavLink>
			<NavLink
				to="/roles"
				activeClassName="active"
			>
				<Button minimal icon="layers" text="Roles" />
			</NavLink>
			<NavLink
				to="/permissions"
				activeClassName="active"
			>
				<Button minimal icon="layer" text="Permissions" />
			</NavLink>
			<NavLink
				to="/policies"
				activeClassName="active"
			>
				<Button minimal icon="take-action" text="Policies" />
			</NavLink>
			<NavLink
			    to="/api-keys"
				activeClassName="active"
			>
				<Button minimal icon="key" text="API Keys" />
			</NavLink>
		</Navbar.Group>
	</Navbar>
  );
}

export default Nav;
