use chrono::{DateTime, Utc};
use uuid::Uuid;
use crate::{User, Role, Group};

pub struct Permission {
    id: Uuid,
    realm_id: Uuid,
    pub name: String,
    pub description: String,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

pub struct NewPermission {
    pub name: String,
    pub description: String,
}

pub struct UpdatePermission {
    pub id: Uuid,
    pub name: Option<String>,
    pub description: Option<String>,
}

pub struct AddPermissionToUser {
    pub user_id: Uuid,
    pub permission_id: Uuid,
}

pub struct RemovePermissionFromUser {
    pub user_id: Uuid,
    pub permission_id: Uuid,
}

pub struct AddPermissionToRole {
    pub permission_id: Uuid,
    pub role_id: Uuid,
}

pub struct RemovePermissionFromRole {
    pub permission_id: Uuid,
    pub role_id: Uuid,
}

pub struct AddPermissionToGroup {
    pub permission_id: Uuid,
    pub group_id: Uuid,
}

pub struct RemovePermissionFromGroup {
    pub permission_id: Uuid,
    pub group_id: Uuid,
}

impl Permission {
    pub fn id(&self) -> Uuid {
        self.id
    }
    pub fn realm_id(&self) -> Uuid {
        self.realm_id
    }
    pub fn new(
        id: Uuid,
        realm_id: Uuid,
        name: String,
        description: String,
        created_at: DateTime<Utc>,
        updated_at: DateTime<Utc>,
    ) -> Self {
        Self {
            id,
            realm_id,
            name,
            description,
            created_at,
            updated_at,
        }
    }
    pub fn add_user(&self, user: User) -> Result<AddPermissionToUser, crate::Error> {
        if user.realm_id() != self.realm_id() {
            return Err(crate::Error::UserNotInPermissionsRealm)
        }
        Ok(AddPermissionToUser{
            user_id: user.id(),
            permission_id: self.id(),
        })
    }

    pub fn remove_user(&self, user: User) -> Result<RemovePermissionFromUser, crate::Error> {
        if user.realm_id() != self.realm_id() {
            return Err(crate::Error::UserNotInPermissionsRealm)
        }
        Ok(RemovePermissionFromUser{
            user_id: user.id(),
            permission_id: self.id(),
        })
    }

    pub fn add_role(&self, role: Role) -> Result<AddPermissionToRole, crate::Error> {
        if role.realm_id() != self.realm_id() {
            return Err(crate::Error::RoleNotInPermissionsRealm)
        }
        Ok(AddPermissionToRole{
            role_id: role.id(),
            permission_id: self.id(),
        })
    }

    pub fn remove_role(&self, role: Role) -> Result<RemovePermissionFromRole, crate::Error> {
        if role.realm_id() != self.realm_id() {
            return Err(crate::Error::RoleNotInPermissionsRealm)
        }
        Ok(RemovePermissionFromRole{
            role_id: role.id(),
            permission_id: self.id(),
        })
    }

    pub fn add_group(&self, group: Group) -> Result<AddPermissionToGroup, crate::Error> {
        if group.realm_id() != self.realm_id() {
            return Err(crate::Error::GroupNotInPermissionsRealm)
        }
        Ok(AddPermissionToGroup{
            group_id: group.id(),
            permission_id: self.id(),
        })
    }

    pub fn remove_group(&self, group: Group) -> Result<RemovePermissionFromGroup, crate::Error> {
        if group.realm_id() != self.realm_id() {
            return Err(crate::Error::RoleNotInPermissionsRealm)
        }
        Ok(RemovePermissionFromGroup{
            group_id: group.id(),
            permission_id: self.id(),
        })
    }
}
