use chrono::{DateTime, Utc};
use uuid::Uuid;

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
}
