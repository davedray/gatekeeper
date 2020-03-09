import axios from 'axios';
import {Realm, NewUser, User, Group, NewGroup, UpdateGroup} from "../types";

export interface RealmsResult {
    realms: Realm[];
    count: number;
}

export interface UsersResult {
    users: User[];
    count: number;
}

export interface GroupsResult {
    groups: Group[];
    count: number;
}

export interface GroupUsersResult {
    ids: string[];
    count: number;
}

export interface RealmResult extends Realm{}
export interface UserResult extends User{}
export interface GroupResult extends Group{}

export default {
    async getRealms(): Promise<RealmsResult> {
        const result = await axios.get<RealmsResult>('/api/realms');
        return result.data;
    },
    async createRealm(realm: Omit<Realm, 'id'>): Promise<RealmResult> {
        const result = await axios.post<Realm>('/api/realms', realm);
        return result.data;
    },
    async updateRealm(realm: Realm): Promise<RealmResult> {
        const result = await axios.put(`/api/realms/${realm.id}`, realm);
        return result.data;
    },
    async deleteRealm(realm: Realm): Promise<void> {
        await axios.delete(`/api/realms/${realm.id}`);
    },
    async getUsers(realm: Realm): Promise<UsersResult> {
        const result = await axios.get<UsersResult>(`/api/realms/${realm.id}/users`);
        return result.data;
    },
    async createUser(realm: Realm, user:NewUser): Promise<UserResult> {
        const result = await axios.post<User>(`/api/realms/${realm.id}/users`, user);
        return result.data;
    },
    async banUser(user: User): Promise<UserResult> {
        const result = await axios.put(`/api/users/${user.id}/ban`);
        return result.data;
    },
    async unbanUser(user: User): Promise<UserResult> {
        const result = await axios.put(`/api/users/${user.id}/unban`);
        return result.data;
    },
    async suspendUser(user: User, until: Date): Promise<UserResult> {
        const result = await axios.put(`/api/users/${user.id}/suspend`, {
            suspendedUntil: until
        });
        return result.data;
    },
    async deleteUser(user: User): Promise<void> {
        await axios.delete(`/api/users/${user.id}`);
    },
    async getGroups(realm: Realm): Promise<GroupsResult> {
        const result = await axios.get<GroupsResult>(`/api/realms/${realm.id}/groups`);
        return result.data;
    },
    async createGroup(realm: Realm, group:NewGroup): Promise<GroupResult> {
        const result = await axios.post<Group>(`/api/realms/${realm.id}/groups`, group);
        return result.data;
    },
    async updateGroup(group: UpdateGroup): Promise<GroupResult> {
        const {id, ...props} = group;
        const result = await axios.patch(`/api/groups/${id}`, props);
        return result.data;
    },
    async deleteGroup(group: Group): Promise<void> {
        await axios.delete(`/api/groups/${group.id}`);
    },
    async getGroupUsers(group: Group): Promise<string[]> {
        let response = await axios.get<GroupUsersResult>(`/api/groups/${group.id}/users`);
        return response.data.ids;
    },
    async createGroupUser(group: Group, user: User): Promise<void> {
        await axios.post(`/api/groups/${group.id}/users/${user.id}`);
    },
    async deleteGroupUser(group: Group, user: User): Promise<void> {
        await axios.delete<GroupUsersResult>(`/api/groups/${group.id}/users/${user.id}`);
    },
}