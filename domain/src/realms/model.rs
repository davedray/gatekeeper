use uuid::Uuid;
use chrono::{DateTime, Utc};

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

impl Realm {
    pub fn new(id: Uuid, name: String, description: String, enabled: bool, created_at: DateTime<Utc>, updated_at: DateTime<Utc>) -> Self {
        Self{
            id,
            name,
            description,
            enabled,
            created_at,
            updated_at
        }
    }

    pub fn id(&self) -> Uuid {
        self.id
    }
}