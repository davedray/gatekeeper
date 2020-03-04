import React, {FunctionComponent, createContext, useReducer, Dispatch} from 'react';

const initialState: realmsState = {
    realms: [],
};

const store = createContext(initialState);

interface realmsState {
    realms: realm[];
    realm?: realm;
}

export interface realm {
    id: string;
    name: string;
    description: string;
    enabled: boolean
}


interface action {
    type: actionType,
}

interface realmSelectAction extends action {
    type: 'SELECT_REALM';
    realm: realm;
}

interface realmCreateAction extends action {
    type: 'ADD_REALMS';
    realms: realm[];
}

interface realmDeleteAction extends action {
    type: 'REMOVE_REALMS';
    realms: realm[];
}

type actions =
    | realmCreateAction
    | realmDeleteAction
    | realmSelectAction

type actionType =
    | 'ADD_REALMS'
    | 'REMOVE_REALMS'
    | 'SELECT_REALM'

const { Provider } = store;

let dispatch: Dispatch<actions> = (action: actions) => {};

const StateProvider: FunctionComponent = ( { children } ) => {
    const [state, _dispatch] = useReducer((state: realmsState, action: actions) => {
        switch(action.type) {
            case 'ADD_REALMS':
                const newState = {
                    ...state,
                }
                newState.realms = newState.realms.filter((r) => {
                    return !action.realms.some((rr) => rr.id === r.id);
                }).concat(action.realms).sort((a, b) => {
                    if (a.name === 'root') {
                        return -1;
                    } else if (b.name === 'root') {
                        return 1;
                    }
                    return a.name.localeCompare(b.name)
                });
                return newState;
            case "REMOVE_REALMS":
                return {
                    ...state,
                    realms: state.realms.filter((r) => !action.realms.some((rr) => rr === r))
                };
            case "SELECT_REALM":
                console.log(action, state);
                return {
                    ...state,
                    realm: action.realm
                }
            default:
                throw new Error();
        };
    }, initialState);
    dispatch = _dispatch;
    return <Provider value={{...state }}>{children}</Provider>;
};

const toJSON = (response: Response) => {
    if (response.status >= 400) {
        throw new Error('Internal Server Error');
    }
    if (response.ok) {
        return response.json();;
    } else {
        try {
            throw response.json();
        } catch(e) {
            console.error(e);
            throw e;
        }
    }
};

const toText = (response: Response) => {
    if (response.ok) {
        return response.text();;
    } else {
        try {
            throw response.text();
        } catch(e) {
            console.error(e);
            throw e;
        }
    }
};

const actions = {
    fetchRealms() {
        return fetch('/api/realms')
            .then(toJSON)
            .then((data) => {
                dispatch({
                    type: 'ADD_REALMS',
                    realms: data.realms,
                })
            });
    },
    createRealm(realm: Omit<realm, 'id'>) {
        return fetch(`/api/realms`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(realm)
        })
            .then(toJSON)
            .then((data) => {
                dispatch({
                    type: 'ADD_REALMS',
                    realms: [data]
                })
            })
    },
    updateRealm(realm: realm) {
        return fetch(`/api/realms/${realm.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(realm)
        })
            .then(toJSON)
            .then((data) => {
                dispatch({
                    type: 'ADD_REALMS',
                    realms: [data]
                })
            })
    },
    deleteRealm(realm: realm) {
        return fetch(`/api/realms/${realm.id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(realm)
        })
            .then(toText)
            .then((data) => {
                dispatch({
                    type: 'REMOVE_REALMS',
                    realms: [realm]
                })
            })
    },
    selectRealm(realm: realm) {
        dispatch({
            type: 'SELECT_REALM',
            realm
        })
    }
}
export { store, actions, StateProvider }
