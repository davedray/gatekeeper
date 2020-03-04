use crate::{Realm, NewRealm, Error, UpdateRealm};
use uuid::Uuid;
pub trait Repository {
    fn list_realms(
        &self
    ) -> Result<Vec<Realm>, Error>;
    fn create_realm(
        &self,
        realm: NewRealm
    ) -> Result<Realm, Error>;
    fn update_realm(
        &self,
        realm: UpdateRealm
    ) -> Result<Realm, Error>;
    fn delete_realm(&self, realm: Uuid) -> Option<Error>;
}