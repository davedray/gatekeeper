use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct PermissionsResponse {
    pub permissions: Vec<PermissionResponse>,
    pub count: u64,
}
impl<T: Into<PermissionResponse>> From<Vec<T>> for PermissionsResponse {
    fn from(permissions: Vec<T>) -> Self {
        let count = permissions.len() as u64;
        let permissions = permissions.into_iter().map(|r| r.into()).collect();
        Self { permissions, count }
    }
}
#[derive(Serialize, Deserialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct PermissionResponse {
    pub id: String,
    pub realm_id: String,
    pub name: String,
    pub description: String,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}
impl From<domain::Permission> for PermissionResponse {
    fn from(a: domain::Permission) -> Self {
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