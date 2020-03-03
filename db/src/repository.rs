use crate::Postgres;
use crate::queries;
use domain::{Repository as RepositoryInterface, NewRealm, UpdateRealm, Realm, DatabaseError};
use diesel::result::{Error};
use anyhow::Error as OpaqueError;
use uuid::Uuid;
/// Helper function to cast a diesel::Error into a domain Database Error.
/// This requires casting the diesel::Error into anyhow::Error first.
pub fn to_db_error(e: Error) -> DatabaseError {
    DatabaseError::from(OpaqueError::from(e))
}

#[derive(Clone)]
pub struct Repository(pub Postgres);

impl RepositoryInterface for Repository {
    fn list_realms(&self) -> Result<Vec<Realm>, DatabaseError> {
        match queries::realms::find(&self.0) {
            Err(e) => Err(to_db_error(e)),
            Ok(realms) => Ok(realms.iter().map(|r| Realm::from(r.clone())).collect())
        }
    }
    fn create_realm(&self, realm: NewRealm) -> Result<Realm, DatabaseError> {
        match queries::realms::create(&self.0, realm.into()) {
            Err(e) => Err(to_db_error(e)),
            Ok(realm) => Ok(Realm::from(realm))
        }
    }
    fn update_realm(&self, realm: UpdateRealm) -> Result<Realm, DatabaseError> {
        match queries::realms::update(&self.0, realm.into()) {
            Err(e) => Err(to_db_error(e)),
            Ok(realm) => Ok(Realm::from(realm))
        }
    }

    fn delete_realm(&self, realm: Uuid) -> Option<DatabaseError> {
        queries::realms::delete(&self.0, realm).map(to_db_error)
    }
}