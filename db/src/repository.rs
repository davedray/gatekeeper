use std::borrow::Borrow;

use diesel::result::{DatabaseErrorKind, Error as DieselError};
use domain::{AddRealmUser, Error, NewRealm, Realm, Repository as RepositoryInterface, UpdateRealm, User, SuspendUser, ChangeUserPassword, BanUser, ChangeUsername};
use uuid::Uuid;

use crate::queries;
use crate::Postgres;

#[derive(Clone)]
pub struct Repository(pub Postgres);

impl RepositoryInterface for Repository {

    fn list_realms(&self) -> Result<Vec<Realm>, Error> {
        match queries::realms::find(&self.0) {
            Err(error) => Err(Error::Database(error.to_string())),
            Ok(realms) => Ok(realms.iter().map(|r| Realm::from(r.clone())).collect()),
        }
    }

    fn get_realm(&self, id: Uuid) -> Result<Realm, Error> {
        match queries::realms::find_one(&self.0, id) {
            Err(error) => Err(Error::Database(error.to_string())),
            Ok(realm) => Ok(Realm::from(realm))
        }
    }

    fn create_realm(&self, realm: NewRealm) -> Result<Realm, Error> {
        let name = realm.borrow().name.clone();
        match queries::realms::create(&self.0, realm.into()) {
            Err(error) => {
                let msg = error.to_string();
                match error {
                    DieselError::DatabaseError(kind, info) => {
                        if let DatabaseErrorKind::UniqueViolation = kind {
                            return Err(Error::DuplicateRealm(name));
                        }
                        Err(Error::Database(info.message().to_string()))
                    }
                    _ => Err(Error::Database(msg)),
                }
            }
            Ok(realm) => Ok(Realm::from(realm)),
        }
    }
    fn update_realm(&self, realm: UpdateRealm) -> Result<Realm, Error> {
        match queries::realms::update(&self.0, realm.into()) {
            Err(e) => Err(Error::Database(e.to_string())),
            Ok(realm) => Ok(Realm::from(realm)),
        }
    }

    fn delete_realm(&self, realm: Uuid) -> Option<Error> {
        queries::realms::delete(&self.0, realm).map(|e| Error::Database(e.to_string()))
    }

    fn create_realm_user(&self, user: AddRealmUser) -> Result<User, Error> {
        let username = user.borrow().username.clone();
        match queries::users::create(&self.0, user.into()) {
            Err(error) => {
                let msg = error.to_string();
                Err(handle_unique_error(msg, username, error))
            }
            Ok(user) => Ok(User::from(user)),
        }
    }

    fn list_realm_users(&self, realm: Uuid) -> Result<Vec<User>, Error> {
        match queries::realms::list_users(&self.0, realm) {
            Err(error) => Err(Error::Database(error.to_string())),
            Ok(realms) => Ok(realms.iter().map(|r| User::from(r.clone())).collect()),
        }
    }

    fn user_update_username(&self, user: ChangeUsername) -> Result<User, Error> {
        let username = user.borrow().username.clone();
        match queries::users::update_username(&self.0, user.into()) {
            Err(error) => {
                let msg = error.to_string();
                Err(handle_unique_error(msg, username, error))
            }
            Ok(user) => Ok(User::from(user)),
        }
    }

    fn user_update_banned(&self, user: BanUser) -> Result<User, Error> {
        match queries::users::ban(&self.0, user.into()) {
            Err(error) => Err(Error::Database(error.to_string())),
            Ok(user) => Ok(User::from(user)),
        }
    }

    fn user_update_suspended(&self, user: SuspendUser) -> Result<User, Error> {
        match queries::users::suspend(&self.0, user.into()) {
            Err(error) => Err(Error::Database(error.to_string())),
            Ok(user) => Ok(User::from(user)),
        }
    }

    fn user_update_password(&self, user: ChangeUserPassword) -> Result<User, Error> {
        match queries::users::update_password(&self.0, user.into()) {
            Err(error) => Err(Error::Database(error.to_string())),
            Ok(user) => Ok(User::from(user)),
        }
    }

    fn delete_user(&self, user: Uuid) -> Option<Error> {
        queries::users::delete(&self.0, user).map(|e| Error::Database(e.to_string()))
    }
}

fn handle_unique_error(msg: String, name: String, error: DieselError) -> Error {
    match error {
        DieselError::DatabaseError(kind, info) => {
            if let DatabaseErrorKind::UniqueViolation = kind {
                return Error::DuplicateRealm(name);
            }
            Error::Database(info.message().to_string())
        }
        _ => Error::Database(msg),
    }
}
