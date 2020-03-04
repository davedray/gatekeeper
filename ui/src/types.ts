export type Realm = {
    id: string;
    name: string;
    description: string;
    enabled: boolean
}

export type User = {
    id: string;
    realmId: string;
    username: string;
    banned: boolean;
    suspendedUntil: Date|null;
}

export type NewUser = {
    username: string;
    password: string;
    suspendedUntil?: Date|null;
}