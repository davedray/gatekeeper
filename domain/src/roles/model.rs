use chrono::{DateTime, Utc};
use uuid::Uuid;
use crate::User;

pub struct Role {
    id: Uuid,
    realm_id: Uuid,
    pub name: String,
    pub description: String,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

pub struct NewRole {
    pub name: String,
    pub description: String,
}

pub struct UpdateRole {
    pub id: Uuid,
    pub name: Option<String>,
    pub description: Option<String>,
}

pub struct AddUserToRole {
    pub user_id: Uuid,
    pub role_id: Uuid,
}

pub struct RemoveUserFromRole {
    pub user_id: Uuid,
    pub role_id: Uuid,
}

impl Role {
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
    pub fn add_user(&self, user: User) -> Result<AddUserToRole, crate::Error> {
        if user.realm_id() != self.realm_id() {
            return Err(crate::Error::UserNotInRolesRealm)
        }
        Ok(AddUserToRole{
            user_id: user.id(),
            role_id: self.id(),
        })
    }

    pub fn remove_user(&self, user: User) -> Result<RemoveUserFromRole, crate::Error> {
        if user.realm_id() != self.realm_id() {
            return Err(crate::Error::UserNotInRolesRealm)
        }
        Ok(RemoveUserFromRole{
            user_id: user.id(),
            role_id: self.id(),
        })
    }
}
