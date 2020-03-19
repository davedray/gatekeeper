use chrono::{DateTime, Utc};
use diesel::{AsChangeset, Insertable, Queryable};
use serde::{Deserialize, Serialize};
use uuid::Uuid;

use crate::models::{Realm, Role, User, Group};
use crate::schema::{permissions, users_permissions, roles_permissions, groups_permissions};

#[derive(Insertable, Identifiable, Queryable, Associations, Serialize, Deserialize, PartialEq, Debug, Clone)]
#[belongs_to(Realm, foreign_key = "realm_id")]
pub struct Permission {
    pub id: Uuid,
    pub realm_id: Uuid,
    pub name: String,
    pub description: String,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

#[derive(Identifiable, Insertable, Queryable, Associations, Serialize, Deserialize, PartialEq, Debug, Clone)]
#[belongs_to(Permission, foreign_key = "permission_id")]
#[belongs_to(User, foreign_key = "user_id")]
#[primary_key(user_id, permission_id)]
#[table_name="users_permissions"]
pub struct UserPermission {
    pub user_id: Uuid,
    pub permission_id: Uuid,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

#[derive(Identifiable, Serialize, Deserialize, PartialEq, Debug, Clone)]
#[primary_key(user_id, permission_id)]
#[table_name="users_permissions"]
pub struct DeleteUserPermission {
    pub user_id: Uuid,
    pub permission_id: Uuid,
}

#[derive(Identifiable, Insertable, Queryable, Associations, Serialize, Deserialize, PartialEq, Debug, Clone)]
#[belongs_to(Permission, foreign_key = "permission_id")]
#[belongs_to(Group, foreign_key = "group_id")]
#[primary_key(group_id, permission_id)]
#[table_name="groups_permissions"]
pub struct GroupPermission {
    pub group_id: Uuid,
    pub permission_id: Uuid,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

#[derive(Identifiable, Serialize, Deserialize, PartialEq, Debug, Clone)]
#[primary_key(group_id, permission_id)]
#[table_name="groups_permissions"]
pub struct DeleteGroupPermission {
    pub group_id: Uuid,
    pub permission_id: Uuid,
}

#[derive(Identifiable, Insertable, Queryable, Associations, Serialize, Deserialize, PartialEq, Debug, Clone)]
#[belongs_to(Permission, foreign_key = "permission_id")]
#[belongs_to(Role, foreign_key = "role_id")]
#[primary_key(role_id, permission_id)]
#[table_name="roles_permissions"]
pub struct RolePermission {
    pub role_id: Uuid,
    pub permission_id: Uuid,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

#[derive(Identifiable, Serialize, Deserialize, PartialEq, Debug, Clone)]
#[primary_key(role_id, permission_id)]
#[table_name="roles_permissions"]
pub struct DeleteRolePermission {
    pub role_id: Uuid,
    pub permission_id: Uuid,
}

impl UserPermission {
    pub fn from(a: domain::AddPermissionToUser) -> Self {
        Self {
            user_id: a.user_id,
            permission_id: a.permission_id,
            created_at: Utc::now(),
            updated_at: Utc::now(),
        }
    }
}

impl From<domain::RemovePermissionFromUser> for DeleteUserPermission {
    fn from(a: domain::RemovePermissionFromUser) -> Self {
        Self {
            user_id: a.user_id,
            permission_id: a.permission_id,
        }
    }
}

impl RolePermission {
    pub fn from(a: domain::AddPermissionToRole) -> Self {
        Self {
            role_id: a.role_id,
            permission_id: a.permission_id,
            created_at: Utc::now(),
            updated_at: Utc::now(),
        }
    }
}

impl From<domain::RemovePermissionFromRole> for DeleteRolePermission {
    fn from(a: domain::RemovePermissionFromRole) -> Self {
        Self {
            role_id: a.role_id,
            permission_id: a.permission_id,
        }
    }
}

impl GroupPermission {
    pub fn from(a: domain::AddPermissionToGroup) -> Self {
        Self {
            group_id: a.group_id,
            permission_id: a.permission_id,
            created_at: Utc::now(),
            updated_at: Utc::now(),
        }
    }
}

impl From<domain::RemovePermissionFromGroup> for DeleteGroupPermission {
    fn from(a: domain::RemovePermissionFromGroup) -> Self {
        Self {
            group_id: a.group_id,
            permission_id: a.permission_id,
        }
    }
}

impl From<Permission> for domain::Permission {
    fn from(a: Permission) -> Self {
        domain::Permission::new(
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
#[table_name = "permissions"]
pub struct UpdatePermission {
    pub id: Uuid,
    pub name: Option<String>,
    pub description: Option<String>,
    pub updated_at: DateTime<Utc>,
}

impl Permission {
    pub fn from(a: domain::AddRealmPermission) -> Self {
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

impl UpdatePermission {
    pub fn from(a: domain::UpdatePermission) -> Self {
        Self {
            id: a.id,
            name: a.name,
            description: a.description,
            updated_at: Utc::now(),
        }
    }
}