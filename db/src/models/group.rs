use chrono::{DateTime, Utc};
use diesel::{AsChangeset, Insertable, Queryable};
use serde::{Deserialize, Serialize};
use uuid::Uuid;

use crate::models::{Realm, Role, User};
use crate::schema::{groups, groups_roles, users_groups};

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

#[derive(Identifiable, Insertable, Queryable, Associations, Serialize, Deserialize, PartialEq, Debug, Clone)]
#[belongs_to(Group, foreign_key = "group_id")]
#[belongs_to(User, foreign_key = "user_id")]
#[primary_key(user_id, group_id)]
#[table_name="users_groups"]
pub struct GroupUser {
    pub group_id: Uuid,
    pub user_id: Uuid,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

#[derive(Identifiable, Serialize, Deserialize, PartialEq, Debug, Clone)]
#[primary_key(user_id, group_id)]
#[table_name="users_groups"]
pub struct DeleteGroupUser {
    pub group_id: Uuid,
    pub user_id: Uuid,
}

#[derive(Identifiable, Insertable, Queryable, Associations, Serialize, Deserialize, PartialEq, Debug, Clone)]
#[belongs_to(Group, foreign_key = "group_id")]
#[belongs_to(Role, foreign_key = "role_id")]
#[primary_key(group_id, role_id)]
#[table_name="groups_roles"]
pub struct GroupRole {
    pub group_id: Uuid,
    pub role_id: Uuid,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

#[derive(Identifiable, Serialize, Deserialize, PartialEq, Debug, Clone)]
#[primary_key(group_id, role_id)]
#[table_name="groups_roles"]
pub struct DeleteGroupRole {
    pub group_id: Uuid,
    pub role_id: Uuid,
}

impl GroupUser {
    pub fn from(a: domain::AddUserToGroup) -> Self {
        Self {
            user_id: a.user_id,
            group_id: a.group_id,
            created_at: Utc::now(),
            updated_at: Utc::now(),
        }
    }
}

impl From<domain::RemoveUserFromGroup> for DeleteGroupUser {
    fn from(a: domain::RemoveUserFromGroup) -> Self {
        Self {
            user_id: a.user_id,
            group_id: a.group_id,
        }
    }
}

impl GroupRole {
    pub fn from(a: domain::AddRoleToGroup) -> Self {
        Self {
            role_id: a.role_id,
            group_id: a.group_id,
            created_at: Utc::now(),
            updated_at: Utc::now(),
        }
    }
}

impl From<domain::RemoveRoleFromGroup> for DeleteGroupRole {
    fn from(a: domain::RemoveRoleFromGroup) -> Self {
        Self {
            role_id: a.role_id,
            group_id: a.group_id,
        }
    }
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