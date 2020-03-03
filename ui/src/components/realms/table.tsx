import React from 'react';
import {
    HTMLTable,
} from "@blueprintjs/core";
import TableRow from "./tableRow";
import { realm} from "../../store";

interface props {
    realms: realm[]
}
function RealmCard({realms}: props) {
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
          {realms.map((realm) => (
              <TableRow
                  key={realm.id}
                  realm={realm}
              />
          ))}
          </tbody>
      </HTMLTable>
    );
}

export default RealmCard;
