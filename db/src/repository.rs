use crate::Postgres;
use crate::queries;
use domain::{Repository as RepositoryInterface, NewRealm, UpdateRealm, Realm, Error};
use diesel::result::{Error as DieselError, DatabaseErrorKind};
use uuid::Uuid;
use std::borrow::Borrow;

#[derive(Clone)]
pub struct Repository(pub Postgres);

impl RepositoryInterface for Repository {
    fn list_realms(&self) -> Result<Vec<Realm>, Error> {
        match queries::realms::find(&self.0) {
            Err(error) => Err(Error::Database(error.to_string())),
            Ok(realms) => Ok(realms.iter().map(|r| Realm::from(r.clone())).collect())
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
                    },
                    _ => Err(Error::Database(msg))
                }
            },
            Ok(realm) => Ok(Realm::from(realm))
        }
    }
    fn update_realm(&self, realm: UpdateRealm) -> Result<Realm, Error> {
        match queries::realms::update(&self.0, realm.into()) {
            Err(e) => Err(Error::Database(e.to_string())),
            Ok(realm) => Ok(Realm::from(realm))
        }
    }

    fn delete_realm(&self, realm: Uuid) -> Option<Error> {
        queries::realms::delete(&self.0, realm).map(|e| Error::Database(e.to_string()))
    }
}