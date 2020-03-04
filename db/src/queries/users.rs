use diesel::prelude::*;
use diesel::result::Error;
use uuid::Uuid;

use crate::models::{BanUser, NewUser, SuspendUser, UpdateUsername, UpdateUserPassword, User};
use crate::Postgres;

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

pub fn update_username(repo: &Postgres, user: domain::ChangeUsername) -> Result<User, Error> {
    use crate::schema::users::dsl::*;
    let u = UpdateUsername::from(user);
    diesel::update(users.find(u.id))
        .set(&u)
        .returning((id, realm_id, username, banned, suspended_until, created_at, updated_at))
        .get_result::<User>(&repo.conn())
}

pub fn ban(repo: &Postgres, user: domain::BanUser) -> Result<User, Error> {
    use crate::schema::users::dsl::*;
    let u = BanUser::from(user);
    diesel::update(users.find(u.id))
        .set(&u)
        .returning((id, realm_id, username, banned, suspended_until, created_at, updated_at))
        .get_result::<User>(&repo.conn())
}

pub fn suspend(repo: &Postgres, user: domain::SuspendUser) -> Result<User, Error> {
    use crate::schema::users::dsl::*;
    let u = SuspendUser::from(user);
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
