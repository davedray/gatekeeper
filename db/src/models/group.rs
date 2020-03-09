use chrono::{DateTime, Utc};
use diesel::{AsChangeset, Insertable, Queryable};
use serde::{Deserialize, Serialize};
use uuid::Uuid;

use crate::models::Realm;
use crate::schema::groups;

#[derive(Insertable, Identifiable, Queryable, Associations, Serialize, Deserialize, PartialEq, Debug, Clone)]
#[belongs_to(Realm, foreign_key = "realm_id")]
pub struct Group {
    pub id: Uuid,
    pub realm_id: Uuid,
    pub name: String,
    pub description: String,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

impl From<Group> for domain::Group {
    fn from(a: Group) -> Self {
        domain::Group::new(
            a.id,
            a.realm_id,
            a.name,
            a.description,
            a.created_at,
            a.updated_at,
        )
    }
}
#[derive(AsChangeset)]
#[table_name = "groups"]
pub struct UpdateGroup {
    pub id: Uuid,
    pub name: Option<String>,
    pub description: Option<String>,
    pub updated_at: DateTime<Utc>,
}

impl Group {
    pub fn from(a: domain::AddRealmGroup) -> Self {
        Self {
            id: Uuid::new_v4(),
            realm_id: a.realm_id,
            name: a.name,
            description: a.description,
            created_at: Utc::now(),
            updated_at: Utc::now(),
        }
    }
}

impl UpdateGroup {
    pub fn from(a: domain::UpdateGroup) -> Self {
        Self {
            id: a.id,
            name: a.name,
            description: a.description,
            updated_at: Utc::now(),
        }
    }
}