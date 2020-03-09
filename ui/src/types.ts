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
    suspendedUntil: string|null;
}

export type NewUser = {
    username: string;
    password: string;
    suspendedUntil?: string|null;
}

export type Group = {
    id: string;
    realmId: string;
    name: string;
    description: string;
}

export type UpdateGroup = {
    id: string;
    realmId: string;
    name?: string;
    description?: string;
}

export type NewGroup = Omit<Group, "id">;