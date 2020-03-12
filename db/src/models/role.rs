use chrono::{DateTime, Utc};
use diesel::{AsChangeset, Insertable, Queryable};
use serde::{Deserialize, Serialize};
use uuid::Uuid;

use crate::models::{Realm, User};
use crate::schema::{roles, users_roles};

#[derive(Insertable, Identifiable, Queryable, Associations, Serialize, Deserialize, PartialEq, Debug, Clone)]
#[belongs_to(Realm, foreign_key = "realm_id")]
pub struct Role {
    pub id: Uuid,
    pub realm_id: Uuid,
    pub name: String,
    pub description: String,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

#[derive(Identifiable, Insertable, Queryable, Associations, Serialize, Deserialize, PartialEq, Debug, Clone)]
#[belongs_to(Role, foreign_key = "role_id")]
#[belongs_to(User, foreign_key = "user_id")]
#[primary_key(user_id, role_id)]
#[table_name="users_roles"]
pub struct RoleUser {
    pub role_id: Uuid,
    pub user_id: Uuid,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

#[derive(Identifiable, Serialize, Deserialize, PartialEq, Debug, Clone)]
#[primary_key(user_id, role_id)]
#[table_name="users_roles"]
pub struct DeleteRoleUser {
    pub role_id: Uuid,
    pub user_id: Uuid,
}

impl RoleUser {
    pub fn from(a: domain::AddUserToRole) -> Self {
        Self {
            user_id: a.user_id,
            role_id: a.role_id,
            created_at: Utc::now(),
            updated_at: Utc::now(),
        }
    }
}

impl From<domain::RemoveUserFromRole> for DeleteRoleUser {
    fn from(a: domain::RemoveUserFromRole) -> Self {
        Self {
            user_id: a.user_id,
            role_id: a.role_id,
        }
    }
}

impl From<Role> for domain::Role {
    fn from(a: Role) -> Self {
        domain::Role::new(
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
#[table_name = "roles"]
pub struct UpdateRole {
    pub id: Uuid,
    pub name: Option<String>,
    pub description: Option<String>,
    pub updated_at: DateTime<Utc>,
}

impl Role {
    pub fn from(a: domain::AddRealmRole) -> Self {
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

impl UpdateRole {
    pub fn from(a: domain::UpdateRole) -> Self {
        Self {
            id: a.id,
            name: a.name,
            description: a.description,
            updated_at: Utc::now(),
        }
    }
}