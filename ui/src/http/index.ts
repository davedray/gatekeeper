import axios from 'axios';
import {Group, NewGroup, NewRole, NewUser, Realm, Role, UpdateGroup, UpdateRole, User, NewPermission, UpdatePermission, Permission} from "../types";

export interface RealmsResult {
    realms: Realm[];
    count: number;
}

export interface UsersResult {
    users: User[];
    count: number;
}

export interface PermissionsResult {
    permissions: Permission[];
    count: number;
}

export interface GroupsResult {
    groups: Group[];
    count: number;
}

export interface GroupPermissionsResult {
    ids: string[];
    count: number;
}

export interface PermissionGroupsResult {
    ids: string[];
    count: number;
}

export interface UserPermissionsResult {
    ids: string[];
    count: number;
}

export interface PermissionUsersResult {
    ids: string[];
    count: number;
}

export interface RolePermissionsResult {
    ids: string[];
    count: number;
}

export interface PermissionRolesResult {
    ids: string[];
    count: number;
}

export interface GroupUsersResult {
    ids: string[];
    count: number;
}

export interface UserGroupsResult {
    ids: string[];
    count: number;
}

export interface GroupRolesResult {
    ids: string[];
    count: number;
}

export interface UserRolesResult {
    ids: string[];
    count: number;
}


export interface RoleGroupsResult {
    ids: string[];
    count: number;
}

export interface RolesResult {
    roles: Role[];
    count: number;
}

export interface RoleUsersResult {
    ids: string[];
    count: number;
}

export interface RealmResult extends Realm{}
export interface UserResult extends User{}
export interface GroupResult extends Group{}
export interface RoleResult extends Role{}
export interface PermissionResult extends Permission{}

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
    async createGroup(realm: Realm, group: NewGroup): Promise<GroupResult> {
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
    async getUserGroups(user: User): Promise<string[]> {
        let response = await axios.get<UserGroupsResult>(`/api/users/${user.id}/groups`);
        return response.data.ids;
    },
    async getUserRoles(user: User): Promise<string[]> {
        let response = await axios.get<UserRolesResult>(`/api/users/${user.id}/roles`);
        return response.data.ids;
    },
    async createGroupUser(group: Group, user: User): Promise<void> {
        await axios.post(`/api/groups/${group.id}/users/${user.id}`);
    },
    async deleteGroupUser(group: Group, user: User): Promise<void> {
        await axios.delete<GroupUsersResult>(`/api/groups/${group.id}/users/${user.id}`);
    },
    async getRoles(realm: Realm): Promise<RolesResult> {
        const result = await axios.get<RolesResult>(`/api/realms/${realm.id}/roles`);
        return result.data;
    },
    async createRole(realm: Realm, role: NewRole): Promise<RoleResult> {
        const result = await axios.post<Role>(`/api/realms/${realm.id}/roles`, role);
        return result.data;
    },
    async updateRole(role: UpdateRole): Promise<RoleResult> {
        const {id, ...props} = role;
        const result = await axios.patch(`/api/roles/${id}`, props);
        return result.data;
    },
    async deleteRole(role: Role): Promise<void> {
        await axios.delete(`/api/roles/${role.id}`);
    },
    async getRoleUsers(role: Role): Promise<string[]> {
        let response = await axios.get<RoleUsersResult>(`/api/roles/${role.id}/users`);
        return response.data.ids;
    },
    async createRoleUser(role: Role, user: User): Promise<void> {
        await axios.post(`/api/roles/${role.id}/users/${user.id}`);
    },
    async deleteRoleUser(role: Role, user: User): Promise<void> {
        await axios.delete(`/api/roles/${role.id}/users/${user.id}`);
    },
    async getGroupRoles(group: Group): Promise<string[]> {
        let response = await axios.get<GroupRolesResult>(`/api/groups/${group.id}/roles`);
        return response.data.ids;
    },
    async createGroupRole(group: Group, role: Role): Promise<void> {
        await axios.post(`/api/groups/${group.id}/roles/${role.id}`);
    },
    async deleteGroupRole(group: Group, role: Role): Promise<void> {
        await axios.delete(`/api/groups/${group.id}/roles/${role.id}`);
    },
    async getRoleGroups(role: Role): Promise<string[]> {
        let response = await axios.get<RoleGroupsResult>(`/api/roles/${role.id}/groups`);
        return response.data.ids;
    },
    async createRoleGroup(role: Role, group: Group): Promise<void> {
        await axios.post(`/api/groups/${group.id}/roles/${role.id}`);
    },
    async deleteRoleGroup(role: Role, group: Group): Promise<void> {
        await axios.delete(`/api/groups/${group.id}/roles/${role.id}`);
    },
    async getPermissions(realm: Realm): Promise<PermissionsResult> {
        const result = await axios.get<PermissionsResult>(`/api/realms/${realm.id}/permissions`);
        return result.data;
    },
    async createPermission(realm: Realm, permission: NewPermission): Promise<PermissionResult> {
        const result = await axios.post<Permission>(`/api/realms/${realm.id}/permissions`, permission);
        return result.data;
    },
    async updatePermission(permission: UpdatePermission): Promise<PermissionResult> {
        const {id, ...props} = permission;
        const result = await axios.patch(`/api/permissions/${id}`, props);
        return result.data;
    },
    async deletePermission(permission: Permission): Promise<void> {
        await axios.delete(`/api/permissions/${permission.id}`);
    },
    async getPermissionUsers(permission: Permission): Promise<string[]> {
        let response = await axios.get<PermissionUsersResult>(`/api/permissions/${permission.id}/users`);
        return response.data.ids;
    },
    async createPermissionUser(permission: Permission, user: User): Promise<void> {
        await axios.post(`/api/permissions/${permission.id}/users/${user.id}`);
    },
    async deletePermissionUser(permission: Permission, user: User): Promise<void> {
        await axios.delete(`/api/permissions/${permission.id}/users/${user.id}`);
    },
    async getUserPermissions(user: User): Promise<string[]> {
        let response = await axios.get<UserPermissionsResult>(`/api/users/${user.id}/permissions`);
        return response.data.ids;
    },
    async createUserPermission(user: User, permission: Permission): Promise<void> {
        await axios.post(`/api/permissions/${permission.id}/users/${user.id}`);
    },
    async deleteUserPermission(user: User, permission: Permission): Promise<void> {
        await axios.delete(`/api/permissions/${permission.id}/users/${user.id}`);
    },
    async getGroupPermissions(group: Group): Promise<string[]> {
        let response = await axios.get<GroupPermissionsResult>(`/api/groups/${group.id}/permissions`);
        return response.data.ids;
    },
    async createGroupPermission(group: Group, permission: Permission): Promise<void> {
        await axios.post(`/api/permissions/${permission.id}/groups/${group.id}`);
    },
    async deleteGroupPermission(group: Group, permission: Permission): Promise<void> {
        await axios.delete(`/api/permissions/${permission.id}/groups/${group.id}`);
    },
    async getPermissionGroups(permission: Permission): Promise<string[]> {
        let response = await axios.get<PermissionGroupsResult>(`/api/permissions/${permission.id}/groups`);
        return response.data.ids;
    },
    async createPermissionGroup(permission: Permission, group: Group): Promise<void> {
        await axios.post(`/api/permissions/${permission.id}/groups/${group.id}`);
    },
    async deletePermissionGroup(permission: Permission, group: Group): Promise<void> {
        await axios.delete(`/api/permissions/${permission.id}/groups/${group.id}`);
    },
    async getRolePermissions(role: Role): Promise<string[]> {
        let response = await axios.get<RolePermissionsResult>(`/api/roles/${role.id}/permissions`);
        return response.data.ids;
    },
    async createRolePermission(role: Role, permission: Permission): Promise<void> {
        await axios.post(`/api/permissions/${permission.id}/roles/${role.id}`);
    },
    async deleteRolePermission(role: Role, permission: Permission): Promise<void> {
        await axios.delete(`/api/permissions/${permission.id}/roles/${role.id}`);
    },
    async getPermissionRoles(permission: Permission): Promise<string[]> {
        let response = await axios.get<PermissionRolesResult>(`/api/permissions/${permission.id}/roles`);
        return response.data.ids;
    },
    async createPermissionRole(permission: Permission, role: Role): Promise<void> {
        await axios.post(`/api/permissions/${permission.id}/roles/${role.id}`);
    },
    async deletePermissionRole(permission: Permission, role: Role): Promise<void> {
        await axios.delete(`/api/permissions/${permission.id}/roles/${role.id}`);
    },
}