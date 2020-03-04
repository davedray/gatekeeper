import React from 'react';
import {
    HTMLTable,
} from "@blueprintjs/core";
import TableRow from "./tableRow";
import {Realm} from "../../../types";

interface props {
    realms: any,
    onUpdateRealm: (realm: Realm) => Promise<any>;
    onDeleteRealm: (realm: Realm) => Promise<any>;
}
function RealmCard({realms, onUpdateRealm, onDeleteRealm}: props) {
    return (
      <HTMLTable
        bordered
        style={{width: '100%'}}
      >
          <thead>
            <tr>
                <th>Name</th>
                <th>Enabled</th>
                <th>Actions</th>
            </tr>
          </thead>
          <tbody>
          {realms.map((realm: any) => (
              <TableRow
                  key={realm.id}
                  realm={realm}
                  onUpdate={onUpdateRealm}
                  onDelete={onDeleteRealm}
              />
          ))}
          </tbody>
      </HTMLTable>
    );
}

export default RealmCard;
