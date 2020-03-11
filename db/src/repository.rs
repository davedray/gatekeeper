use std::borrow::Borrow;

use diesel::result::{DatabaseErrorKind, Error as DieselError};
use domain::{AddRealmGroup, AddRealmUser, AddUserToGroup, RemoveUserFromGroup, ChangeUserPassword, Error, Group, LoginUser, NewRealm, Realm, Repository as RepositoryInterface, UpdateGroup, UpdateRealm, UpdateUser, User};
use uuid::Uuid;

use crate::Postgres;
use crate::queries;

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
        match queries::users::find(&self.0, realm) {
            Err(error) => Err(Error::Database(error.to_string())),
            Ok(realms) => Ok(realms.iter().map(|r| User::from(r.clone())).collect()),
        }
    }

    fn find_realm_user_by_username_password(&self, realm_id: Uuid, login: LoginUser) -> Result<User, Error> {
        let username: String = login.username.clone();
        match queries::users::find_for_authentication(&self.0, realm_id, username.clone()) {
            Err(error) => Err(Error::Database(error.to_string())),
            Ok(user) => {
                match user.check_password(login.password) {
                    true => Ok(user.into()),
                    false => Err(Error::LoginFailure)
                }
            }
        }
    }

    fn update_user(&self, user: UpdateUser) -> Result<User, Error> {
        let name = user.borrow().username.clone();
        match queries::users::update(&self.0, user.into()) {
            Err(error) => {
                let msg = error.to_string();
                match name {
                    Some(name) => Err(handle_unique_error(msg, name, error)),
                    _ => Err(Error::Database(error.to_string()))
                }

            }
            Ok(user) => Ok(User::from(user)),
        }
    }

    fn update_user_password(&self, user: ChangeUserPassword) -> Result<User, Error> {
        match queries::users::update_password(&self.0, user.into()) {
            Err(error) => Err(Error::Database(error.to_string())),
            Ok(user) => Ok(User::from(user)),
        }
    }

    fn delete_user(&self, user: Uuid) -> Option<Error> {
        queries::users::delete(&self.0, user).map(|e| Error::Database(e.to_string()))
    }

    fn list_realm_groups(&self, realm: Uuid) -> Result<Vec<Group>, Error> {
        match queries::groups::find(&self.0, realm) {
            Err(error) => Err(Error::Database(error.to_string())),
            Ok(groups) => Ok(groups.iter().map(|r| Group::from(r.clone())).collect()),
        }
    }

    fn get_realm_group(&self, realm_id: Uuid, id: Uuid) -> Result<Group, Error> {
        match queries::realms::find_group(&self.0, realm_id, id) {
            Err(error) => Err(Error::Database(error.to_string())),
            Ok(group) => Ok(Group::from(group))
        }
    }

    fn get_group(&self, id: Uuid) -> Result<Group, Error> {
        match queries::groups::find_one(&self.0,id) {
            Err(error) => Err(Error::Database(error.to_string())),
            Ok(group) => Ok(Group::from(group))
        }
    }

    fn create_realm_group(&self, group: AddRealmGroup) -> Result<Group, Error> {
        let name = group.name.clone();
        match queries::groups::create(&self.0, group.into()) {
            Err(error) => {
                let msg = error.to_string();
                Err(handle_unique_error(msg, name, error))
            },
            Ok(group) => Ok(Group::from(group))
        }
    }

    fn update_group(&self, group: UpdateGroup) -> Result<Group, Error> {
        let name = group.name.clone();
        match queries::groups::update(&self.0, group.into()) {
            Err(error) => {
                let msg = error.to_string();
                match name {
                    Some(name) => Err(handle_unique_error(msg, name, error)),
                    _ => Err(Error::Database(error.to_string()))
                }

            }
            Ok(group) => Ok(Group::from(group)),
        }
    }

    fn delete_group(&self, group: Uuid) -> Option<Error> {
        queries::groups::delete(&self.0, group).map(|e| Error::Database(e.to_string()))
    }

    fn get_realm_user(&self, realm_id: Uuid, id: Uuid) -> Result<User, Error> {
        match queries::users::find_one(&self.0, realm_id, id) {
            Err(error) => Err(Error::Database(error.to_string())),
            Ok(user) => Ok(User::from(user))
        }
    }

    fn user_ids_by_group(&self, group: Uuid) -> Result<Vec<Uuid>, Error> {
        queries::users::ids_by_group(&self.0, group).map_err(|e| Error::Database(e.to_string()))
    }

    fn create_group_user(&self, args: AddUserToGroup) -> Option<Error> {
        match queries::groups::add_user(&self.0, args.into()) {
            Ok(_) => None,
            Err(e) => Some(Error::Database(e.to_string()))
        }
    }

    fn delete_group_user(&self, args: RemoveUserFromGroup) -> Option<Error> {
        queries::groups::remove_user(&self.0, args.into()).map(|e| Error::Database(e.to_string()))
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
