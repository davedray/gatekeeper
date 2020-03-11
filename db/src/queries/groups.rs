use crate::models::{Group, UpdateGroup, GroupUser, DeleteGroupUser};
use crate::Postgres;
use diesel::prelude::*;
use diesel::result::Error;
use uuid::Uuid;

pub fn find(repo: &Postgres, realm: Uuid) -> Result<Vec<Group>, Error> {
    use crate::schema::groups::dsl::*;
    groups.filter(realm_id.eq(realm)).load(&repo.conn())
}

pub fn find_one(repo: &Postgres, uuid: Uuid) -> Result<Group, Error> {
    use crate::schema::groups::dsl::*;
    groups.filter(id.eq(uuid)).first(&repo.conn())
}

pub fn create(repo: &Postgres, group: domain::AddRealmGroup) -> Result<Group, Error> {
    use crate::schema::groups;
    let r = Group::from(group);
    diesel::insert_into(groups::table)
        .values(&r)
        .get_result(&repo.conn())
}

pub fn update(repo: &Postgres, group: domain::UpdateGroup) -> Result<Group, Error> {
    use crate::schema::groups::dsl::*;
    let r = UpdateGroup::from(group);
    diesel::update(groups.find(r.id))
        .set(&r)
        .get_result(&repo.conn())
}

pub fn delete(repo: &Postgres, group: Uuid) -> Option<Error> {
    use crate::schema::groups::dsl::*;
    diesel::delete(groups.find(group))
        .execute(&repo.conn())
        .err()
}

pub fn add_user(repo: &Postgres, user_group: domain::AddUserToGroup) -> Result<GroupUser, Error> {
    use crate::schema::users_groups;
    let r = GroupUser::from(user_group);
    diesel::insert_into(users_groups::table).values(&r).get_result(&repo.conn())
}

pub fn remove_user(repo: &Postgres, user_group: domain::RemoveUserFromGroup) -> Option<Error> {
    let r = DeleteGroupUser::from(user_group);
    diesel::delete(&r).execute(&repo.conn()).err()
}