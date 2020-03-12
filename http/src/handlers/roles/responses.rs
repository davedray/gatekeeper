use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct RolesResponse {
    pub roles: Vec<RoleResponse>,
    pub count: u64,
}
impl<T: Into<RoleResponse>> From<Vec<T>> for RolesResponse {
    fn from(roles: Vec<T>) -> Self {
        let count = roles.len() as u64;
        let roles = roles.into_iter().map(|r| r.into()).collect();
        Self { roles, count }
    }
}
#[derive(Serialize, Deserialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct RoleResponse {
    pub id: String,
    pub realm_id: String,
    pub name: String,
    pub description: String,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}
impl From<domain::Role> for RoleResponse {
    fn from(a: domain::Role) -> Self {
        Self {
            id: a.id().to_string(),
            realm_id: a.realm_id().to_string(),
            name: a.name,
            description: a.description,
            created_at: a.created_at,
            updated_at: a.updated_at
        }
    }
}