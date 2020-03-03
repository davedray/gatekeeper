use crate::{Realm, NewRealm, DatabaseError, UpdateRealm};
use uuid::Uuid;
pub trait Repository {
    fn list_realms(
        &self
    ) -> Result<Vec<Realm>, DatabaseError>;
    fn create_realm(
        &self,
        realm: NewRealm
    ) -> Result<Realm, DatabaseError>;
    fn update_realm(
        &self,
        realm: UpdateRealm
    ) -> Result<Realm, DatabaseError>;
    fn delete_realm(&self, realm: Uuid) -> Option<DatabaseError>;
}