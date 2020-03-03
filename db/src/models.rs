use chrono::{DateTime, Utc};
use diesel::{Queryable, Insertable, AsChangeset};
use serde::{Deserialize, Serialize};
use uuid::Uuid;
use crate::schema::realms;

#[derive(Insertable, Queryable, Serialize, Deserialize, Debug, Clone)]
pub struct Realm {
    pub id: Uuid,
    pub name: String,
    pub description: String,
    pub enabled: bool,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

#[derive(AsChangeset)]
#[table_name="realms"]
pub struct UpdateRealm {
    pub id: Uuid,
    pub name: String,
    pub description: String,
    pub enabled: bool,
    pub updated_at: DateTime<Utc>,
}

impl From<Realm> for domain::Realm {
    fn from(r: Realm) -> Self {
        domain::Realm::new(r.id, r.name, r.description, r.enabled, r.created_at, r.updated_at)
    }
}

impl Realm {
    pub fn from(r: domain::Realm) -> Self {
       return Realm {
           id: r.id(),
           name: r.name,
           description: r.description,
           enabled: r.enabled,
           created_at: r.created_at,
           updated_at: r.updated_at
       }
    }

    pub fn from_new(r: domain::NewRealm) -> Self {
        return Realm {
            id: Uuid::new_v4(),
            name: r.name,
            description: r.description,
            enabled: r.enabled,
            created_at: Utc::now(),
            updated_at: Utc::now()
        }
    }
}

impl UpdateRealm {
    pub fn from(r: domain::UpdateRealm) -> Self {
        return UpdateRealm {
            id: r.id,
            name: r.name,
            description: r.description,
            enabled: r.enabled,
            updated_at: Utc::now()
        }
    }
}