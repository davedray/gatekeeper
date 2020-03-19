use chrono::{DateTime, Utc};
use uuid::Uuid;

pub struct Realm {
    id: Uuid,
    pub name: String,
    pub description: String,
    pub enabled: bool,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

pub struct NewRealm {
    pub name: String,
    pub description: String,
    pub enabled: bool,
}

pub struct UpdateRealm {
    pub id: Uuid,
    pub name: String,
    pub description: String,
    pub enabled: bool,
}

pub struct AddRealmUser {
    pub realm_id: Uuid,
    pub username: String,
    pub password: String,
    pub suspended_until: Option<DateTime<Utc>>,
}

pub struct AddRealmGroup {
    pub realm_id: Uuid,
    pub name: String,
    pub description: String,
}

pub struct AddRealmRole {
    pub realm_id: Uuid,
    pub name: String,
    pub description: String,
}

pub struct AddRealmPermission {
    pub realm_id: Uuid,
    pub name: String,
    pub description: String,
}

impl Realm {
    pub fn id(&self) -> Uuid {
        self.id
    }
    pub fn new(
        id: Uuid,
        name: String,
        description: String,
        enabled: bool,
        created_at: DateTime<Utc>,
        updated_at: DateTime<Utc>,
    ) -> Self {
        Self {
            id,
            name,
            description,
            enabled,
            created_at,
            updated_at,
        }
    }

    pub fn add_user(&self, req: crate::NewUser) -> AddRealmUser {
        AddRealmUser {
            realm_id: self.id,
            username: req.username,
            password: req.password,
            suspended_until: req.suspended_until,
        }
    }

    pub fn add_group(&self, req: crate::NewGroup) -> AddRealmGroup {
        AddRealmGroup {
            realm_id: self.id,
            name: req.name,
            description: req.description,
        }
    }

    pub fn add_role(&self, req: crate::NewRole) -> AddRealmRole {
        AddRealmRole {
            realm_id: self.id,
            name: req.name,
            description: req.description,
        }
    }

    pub fn add_permission(&self, req: crate::NewPermission) -> AddRealmPermission {
        AddRealmPermission {
            realm_id: self.id,
            name: req.name,
            description: req.description,
        }
    }
}
