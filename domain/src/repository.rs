use uuid::Uuid;

use crate::{AddRealmGroup, AddRealmUser, AddUserToGroup, RemoveUserFromGroup, ChangeUserPassword, Error, Group, LoginUser, NewRealm, Realm, UpdateGroup, UpdateRealm, UpdateUser, User};

pub trait Repository {
    fn list_realms(&self) -> Result<Vec<Realm>, Error>;
    fn get_realm(&self, id: Uuid) -> Result<Realm, Error>;
    fn create_realm(&self, realm: NewRealm) -> Result<Realm, Error>;
    fn update_realm(&self, realm: UpdateRealm) -> Result<Realm, Error>;
    fn delete_realm(&self, realm: Uuid) -> Option<Error>;
    fn create_realm_user(&self, user: AddRealmUser) -> Result<User, Error>;
    fn list_realm_users(&self, realm: Uuid) -> Result<Vec<User>, Error>;
    fn find_realm_user_by_username_password(&self, realm_id: Uuid, login: LoginUser) -> Result<User, Error>;
    fn get_realm_user(&self, realm_id: Uuid, id: Uuid) -> Result<User, Error>;
    fn update_user(&self, user: UpdateUser) -> Result<User, Error>;
    fn update_user_password(&self, user: ChangeUserPassword) -> Result<User, Error>;
    fn delete_user(&self, user: Uuid) -> Option<Error>;
    fn list_realm_groups(&self, realm: Uuid) -> Result<Vec<Group>, Error>;
    fn get_realm_group(&self, realm_id: Uuid, id: Uuid) -> Result<Group, Error>;
    fn get_group(&self, id: Uuid) -> Result<Group, Error>;
    fn create_realm_group(&self, group: AddRealmGroup) -> Result<Group, Error>;
    fn update_group(&self, group: UpdateGroup) -> Result<Group, Error>;
    fn delete_group(&self, group: Uuid) -> Option<Error>;
    fn user_ids_by_group(&self, group: Uuid) -> Result<Vec<Uuid>, Error>;
    fn create_group_user(&self, args: AddUserToGroup) -> Option<Error>;
    fn delete_group_user(&self, args: RemoveUserFromGroup) -> Option<Error>;
}
