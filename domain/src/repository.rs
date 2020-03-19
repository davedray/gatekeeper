use uuid::Uuid;

use crate::{
    AddRealmGroup,
    AddRealmUser,
    AddRealmRole,
    AddRoleToGroup,
    AddUserToGroup,
    AddUserToRole,
    ChangeUserPassword,
    Error,
    Group,
    LoginUser,
    NewRealm,
    Realm,
    Role,
    RemoveRoleFromGroup,
    RemoveUserFromGroup,
    RemoveUserFromRole,
    UpdateGroup,
    UpdateRealm,
    UpdateRole,
    UpdateUser,
    User,
    Permission,
    AddRealmPermission,
    AddPermissionToRole,
    AddPermissionToUser,
    AddPermissionToGroup,
    UpdatePermission,
    RemovePermissionFromRole,
    RemovePermissionFromUser,
    RemovePermissionFromGroup,
};

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
    fn list_realm_roles(&self, realm: Uuid) -> Result<Vec<Role>, Error>;
    fn get_realm_role(&self, realm_id: Uuid, id: Uuid) -> Result<Role, Error>;
    fn get_role(&self, id: Uuid) -> Result<Role, Error>;
    fn create_realm_role(&self, role: AddRealmRole) -> Result<Role, Error>;
    fn update_role(&self, role: UpdateRole) -> Result<Role, Error>;
    fn delete_role(&self, role: Uuid) -> Option<Error>;
    fn user_ids_by_role(&self, role: Uuid) -> Result<Vec<Uuid>, Error>;
    fn create_role_user(&self, args: AddUserToRole) -> Option<Error>;
    fn delete_role_user(&self, args: RemoveUserFromRole) -> Option<Error>;
    fn create_group_role(&self, args: AddRoleToGroup) -> Option<Error>;
    fn delete_group_role(&self, args: RemoveRoleFromGroup) -> Option<Error>;
    fn role_ids_by_group(&self, group: Uuid) -> Result<Vec<Uuid>, Error>;
    fn group_ids_by_role(&self, role: Uuid) -> Result<Vec<Uuid>, Error>;
    fn group_ids_with_user(&self, user: Uuid) -> Result<Vec<Uuid>, Error>;
    fn role_ids_with_user(&self, user: Uuid) -> Result<Vec<Uuid>, Error>;
    fn user_ids_by_permission(&self, permission: Uuid) -> Result<Vec<Uuid>, Error>;
    fn group_ids_by_permission(&self, permission: Uuid) -> Result<Vec<Uuid>, Error>;
    fn role_ids_by_permission(&self, permission: Uuid) -> Result<Vec<Uuid>, Error>;
    fn permission_ids_by_user(&self, user: Uuid) -> Result<Vec<Uuid>, Error>;
    fn permission_ids_by_group(&self, group: Uuid) -> Result<Vec<Uuid>, Error>;
    fn permission_ids_by_role(&self, role: Uuid) -> Result<Vec<Uuid>, Error>;
    fn list_realm_permissions(&self, realm: Uuid) -> Result<Vec<Permission>, Error>;
    fn get_realm_permission(&self, realm_id: Uuid, id: Uuid) -> Result<Permission, Error>;
    fn get_permission(&self, id: Uuid) -> Result<Permission, Error>;
    fn create_realm_permission(&self, permission: AddRealmPermission) -> Result<Permission, Error>;
    fn update_permission(&self, permission: UpdatePermission) -> Result<Permission, Error>;
    fn delete_permission(&self, permission: Uuid) -> Option<Error>;
    fn create_user_permission(&self, args: AddPermissionToUser) -> Option<Error>;
    fn create_role_permission(&self, args: AddPermissionToRole) -> Option<Error>;
    fn create_group_permission(&self, args: AddPermissionToGroup) -> Option<Error>;
    fn delete_user_permission(&self, args: RemovePermissionFromUser) -> Option<Error>;
    fn delete_role_permission(&self, args: RemovePermissionFromRole) -> Option<Error>;
    fn delete_group_permission(&self, args: RemovePermissionFromGroup) -> Option<Error>;
}
