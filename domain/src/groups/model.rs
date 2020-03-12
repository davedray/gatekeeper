use chrono::{DateTime, Utc};
use uuid::Uuid;
use crate::{User, Role};

pub struct Group {
    id: Uuid,
    realm_id: Uuid,
    pub name: String,
    pub description: String,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

pub struct NewGroup {
    pub name: String,
    pub description: String,
}

pub struct UpdateGroup {
    pub id: Uuid,
    pub name: Option<String>,
    pub description: Option<String>,
}

pub struct AddUserToGroup {
    pub user_id: Uuid,
    pub group_id: Uuid,
}

pub struct RemoveUserFromGroup {
    pub user_id: Uuid,
    pub group_id: Uuid,
}

pub struct AddRoleToGroup {
    pub group_id: Uuid,
    pub role_id: Uuid,
}

pub struct RemoveRoleFromGroup {
    pub group_id: Uuid,
    pub role_id: Uuid,
}

impl Group {
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
    pub fn add_user(&self, user: User) -> Result<AddUserToGroup, crate::Error> {
        if user.realm_id() != self.realm_id() {
            return Err(crate::Error::UserNotInGroupsRealm)
        }
        Ok(AddUserToGroup{
            user_id: user.id(),
            group_id: self.id(),
        })
    }

    pub fn remove_user(&self, user: User) -> Result<RemoveUserFromGroup, crate::Error> {
        if user.realm_id() != self.realm_id() {
            return Err(crate::Error::UserNotInGroupsRealm)
        }
        Ok(RemoveUserFromGroup{
            user_id: user.id(),
            group_id: self.id(),
        })
    }

    pub fn add_role(&self, role: Role) -> Result<AddRoleToGroup, crate::Error> {
        if role.realm_id() != self.realm_id() {
            return Err(crate::Error::RoleNotInGroupsRealm)
        }
        Ok(AddRoleToGroup{
            role_id: role.id(),
            group_id: self.id(),
        })
    }

    pub fn remove_role(&self, role: Role) -> Result<RemoveRoleFromGroup, crate::Error> {
        if role.realm_id() != self.realm_id() {
            return Err(crate::Error::RoleNotInGroupsRealm)
        }
        Ok(RemoveRoleFromGroup{
            role_id: role.id(),
            group_id: self.id(),
        })
    }
}
