import axios from 'axios';
import {Realm, NewUser, User} from "../types";

export interface RealmsResult {
    realms: Realm[];
    count: number;
}

export interface UsersResult {
    users: User[];
    count: number;
}

export interface RealmResult extends Realm{}
export interface UserResult extends User{}

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
        const result = await axios.post<User>('/api/users', user);
        return result.data;
    },
    async banUser(user: User): Promise<UserResult> {
        const result = await axios.put(`/api/realms/${user.id}/ban`);
        return result.data;
    },
    async unbanUser(user: User): Promise<UserResult> {
        const result = await axios.put(`/api/realms/${user.id}/unban`);
        return result.data;
    },
    async suspendUser(user: User): Promise<UserResult> {
        const result = await axios.put(`/api/realms/${user.id}/suspend`);
        return result.data;
    },
    async deleteUser(user: User): Promise<void> {
        await axios.delete(`/api/users/${user.id}`);
    }
}