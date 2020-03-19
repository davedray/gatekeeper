use diesel::prelude::*;
use diesel::result::Error;
use uuid::Uuid;

use crate::models::{
    DeleteRolePermission,
    DeleteUserPermission,
    DeleteGroupPermission,
    Permission,
    RolePermission,
    UserPermission,
    GroupPermission,
    UpdatePermission
};
use crate::Postgres;

pub fn find(repo: &Postgres, realm: Uuid) -> Result<Vec<Permission>, Error> {
    use crate::schema::permissions::dsl::*;
    permissions.filter(realm_id.eq(realm)).load(&repo.conn())
}

pub fn find_one(repo: &Postgres, uuid: Uuid) -> Result<Permission, Error> {
    use crate::schema::permissions::dsl::*;
    permissions.filter(id.eq(uuid)).first(&repo.conn())
}

pub fn create(repo: &Postgres, permission: domain::AddRealmPermission) -> Result<Permission, Error> {
    use crate::schema::permissions;
    let r = Permission::from(permission);
    diesel::insert_into(permissions::table)
        .values(&r)
        .get_result(&repo.conn())
}

pub fn update(repo: &Postgres, permission: domain::UpdatePermission) -> Result<Permission, Error> {
    use crate::schema::permissions::dsl::*;
    let r = UpdatePermission::from(permission);
    diesel::update(permissions.find(r.id))
        .set(&r)
        .get_result(&repo.conn())
}

pub fn delete(repo: &Postgres, permission: Uuid) -> Option<Error> {
    use crate::schema::permissions::dsl::*;
    diesel::delete(permissions.find(permission))
        .execute(&repo.conn())
        .err()
}

pub fn add_user(repo: &Postgres, user_permission: domain::AddPermissionToUser) -> Result<UserPermission, Error> {
    use crate::schema::users_permissions;
    let r = UserPermission::from(user_permission);
    diesel::insert_into(users_permissions::table).values(&r).get_result(&repo.conn())
}

pub fn remove_user(repo: &Postgres, user_permission: domain::RemovePermissionFromUser) -> Option<Error> {
    let r = DeleteUserPermission::from(user_permission);
    diesel::delete(&r).execute(&repo.conn()).err()
}

pub fn add_role(repo: &Postgres, role_permission: domain::AddPermissionToRole) -> Result<RolePermission, Error> {
    use crate::schema::roles_permissions;
    let r = RolePermission::from(role_permission);
    diesel::insert_into(roles_permissions::table).values(&r).get_result(&repo.conn())
}

pub fn remove_role(repo: &Postgres, role_permission: domain::RemovePermissionFromRole) -> Option<Error> {
    let r = DeleteRolePermission::from(role_permission);
    diesel::delete(&r).execute(&repo.conn()).err()
}


pub fn add_group(repo: &Postgres, group_permission: domain::AddPermissionToGroup) -> Result<RolePermission, Error> {
    use crate::schema::groups_permissions;
    let r = GroupPermission::from(group_permission);
    diesel::insert_into(groups_permissions::table).values(&r).get_result(&repo.conn())
}

pub fn remove_group(repo: &Postgres, group_permission: domain::RemovePermissionFromGroup) -> Option<Error> {
    let r = DeleteGroupPermission::from(group_permission);
    diesel::delete(&r).execute(&repo.conn()).err()
}

pub fn ids_by_role(repo: &Postgres, role: Uuid) -> Result<Vec<Uuid>, Error> {
    use crate::schema::roles_permissions::dsl::*;
    roles_permissions.filter(role_id.eq(role)).select(permission_id).load(&repo.conn())
}

pub fn ids_by_user(repo: &Postgres, user: Uuid) -> Result<Vec<Uuid>, Error> {
    use crate::schema::users_permissions::dsl::*;
    users_permissions.filter(user_id.eq(user)).select(permission_id).load(&repo.conn())
}

pub fn ids_by_group(repo: &Postgres, group: Uuid) -> Result<Vec<Uuid>, Error> {
    use crate::schema::groups_permissions::dsl::*;
    groups_permissions.filter(group_id.eq(group)).select(permission_id).load(&repo.conn())
}