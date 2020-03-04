use crate::{AddRealmUser, Error, NewRealm, Realm, UpdateRealm, User, ChangeUsername, BanUser, SuspendUser, ChangeUserPassword};
use uuid::Uuid;
pub trait Repository {
    fn list_realms(&self) -> Result<Vec<Realm>, Error>;
    fn get_realm(&self, id: Uuid) -> Result<Realm, Error>;
    fn create_realm(&self, realm: NewRealm) -> Result<Realm, Error>;
    fn update_realm(&self, realm: UpdateRealm) -> Result<Realm, Error>;
    fn delete_realm(&self, realm: Uuid) -> Option<Error>;
    fn create_realm_user(&self, user: AddRealmUser) -> Result<User, Error>;
    fn user_update_username(&self, user: ChangeUsername) -> Result<User, Error>;
    fn user_update_banned(&self, user: BanUser) -> Result<User, Error>;
    fn user_update_suspended(&self, user: SuspendUser) -> Result<User, Error>;
    fn user_update_password(&self, user: ChangeUserPassword) -> Result<User, Error>;
    fn delete_user(&self, user: Uuid) -> Option<Error>;
    fn list_realm_users(&self, realm: Uuid) -> Result<Vec<User>, Error>;
}
