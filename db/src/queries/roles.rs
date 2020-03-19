use crate::models::{Role, UpdateRole, RoleUser, DeleteRoleUser};
use crate::Postgres;
use diesel::prelude::*;
use diesel::result::Error;
use uuid::Uuid;

pub fn find(repo: &Postgres, realm: Uuid) -> Result<Vec<Role>, Error> {
    use crate::schema::roles::dsl::*;
    roles.filter(realm_id.eq(realm)).load(&repo.conn())
}

pub fn find_one(repo: &Postgres, uuid: Uuid) -> Result<Role, Error> {
    use crate::schema::roles::dsl::*;
    roles.filter(id.eq(uuid)).first(&repo.conn())
}

pub fn create(repo: &Postgres, role: domain::AddRealmRole) -> Result<Role, Error> {
    use crate::schema::roles;
    let r = Role::from(role);
    diesel::insert_into(roles::table)
        .values(&r)
        .get_result(&repo.conn())
}

pub fn update(repo: &Postgres, role: domain::UpdateRole) -> Result<Role, Error> {
    use crate::schema::roles::dsl::*;
    let r = UpdateRole::from(role);
    diesel::update(roles.find(r.id))
        .set(&r)
        .get_result(&repo.conn())
}

pub fn delete(repo: &Postgres, role: Uuid) -> Option<Error> {
    use crate::schema::roles::dsl::*;
    diesel::delete(roles.find(role))
        .execute(&repo.conn())
        .err()
}

pub fn add_user(repo: &Postgres, user_role: domain::AddUserToRole) -> Result<RoleUser, Error> {
    use crate::schema::users_roles;
    let r = RoleUser::from(user_role);
    diesel::insert_into(users_roles::table).values(&r).get_result(&repo.conn())
}

pub fn remove_user(repo: &Postgres, user_role: domain::RemoveUserFromRole) -> Option<Error> {
    let r = DeleteRoleUser::from(user_role);
    diesel::delete(&r).execute(&repo.conn()).err()
}

pub fn ids_by_group(repo: &Postgres, group: Uuid) -> Result<Vec<Uuid>, Error> {
    use crate::schema::groups_roles::dsl::*;
    groups_roles.filter(group_id.eq(group)).select(role_id).load(&repo.conn())
}

pub fn ids_by_user(repo: &Postgres, user: Uuid) -> Result<Vec<Uuid>, Error> {
    use crate::schema::users_roles::dsl::*;
    users_roles.filter(user_id.eq(user)).select(role_id).load(&repo.conn())
}

pub fn ids_by_permission(repo: &Postgres, permission: Uuid) -> Result<Vec<Uuid>, Error> {
    use crate::schema::roles_permissions::dsl::*;
    roles_permissions.filter(permission_id.eq(permission)).select(role_id).load(&repo.conn())
}