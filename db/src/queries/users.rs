use diesel::prelude::*;
use diesel::result::Error;
use uuid::Uuid;

use crate::models::{NewUser, UpdateUserPassword, User, UpdateUser, UserWithPassword};
use crate::Postgres;

pub fn find(repo: &Postgres, realm: Uuid) -> Result<Vec<User>, Error> {
    use crate::schema::users::dsl::*;
    users.filter(realm_id.eq(realm)).select((id, realm_id, username, banned, suspended_until, created_at, updated_at)).load(&repo.conn())
}

pub fn find_one(repo: &Postgres, realm: Uuid, uuid: Uuid) -> Result<User, Error> {
    use crate::schema::users::dsl::*;
    users.filter(realm_id.eq(realm).and(id.eq(uuid))).select((id, realm_id, username, banned, suspended_until, created_at, updated_at)).first(&repo.conn())

}

pub fn find_for_authentication(repo: &Postgres, realm_id: Uuid, username: String) -> Result<UserWithPassword, Error> {
    use crate::schema::users::dsl;
    dsl::users.filter(dsl::realm_id.eq(realm_id).and(dsl::username.eq(username))).first(&repo.conn())
}

pub fn create(repo: &Postgres, user: domain::AddRealmUser) -> Result<User, Error> {
    use crate::schema::users;
    let u = NewUser::from(user);
    let result = diesel::insert_into(users::table)
        .values(&u)
        .execute(&repo.conn());
    match result {
        Ok(_) => Ok(u.into()),
        Err(error) => Err(error),
    }
}

pub fn update_password(repo: &Postgres, user: domain::ChangeUserPassword) -> Result<User, Error> {
    use crate::schema::users::dsl::*;
    let u = UpdateUserPassword::from(user);
    diesel::update(users.find(u.id))
        .set(&u)
        .returning((id, realm_id, username, banned, suspended_until, created_at, updated_at))
        .get_result::<User>(&repo.conn())
}

pub fn update(repo: &Postgres, user: domain::UpdateUser) -> Result<User, Error> {
    use crate::schema::users::dsl::*;
    let u = UpdateUser::from(user);
    diesel::update(users.find(u.id))
        .set(&u)
        .returning((id, realm_id, username, banned, suspended_until, created_at, updated_at))
        .get_result::<User>(&repo.conn())
}

pub fn delete(repo: &Postgres, user: Uuid) -> Option<Error> {
    use crate::schema::users::dsl::*;
    diesel::delete(users.find(user))
        .execute(&repo.conn())
        .err()
}

pub fn ids_by_group(repo: &Postgres, group: Uuid) -> Result<Vec<Uuid>, Error> {
    use crate::schema::users_groups::dsl::*;
    users_groups.filter(group_id.eq(group)).select(user_id).load(&repo.conn())
}
