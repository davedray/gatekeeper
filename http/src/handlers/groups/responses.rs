use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct GroupsResponse {
    pub groups: Vec<GroupResponse>,
    pub count: u64,
}
impl<T: Into<GroupResponse>> From<Vec<T>> for GroupsResponse {
    fn from(groups: Vec<T>) -> Self {
        let count = groups.len() as u64;
        let groups = groups.into_iter().map(|r| r.into()).collect();
        Self { groups, count }
    }
}
#[derive(Serialize, Deserialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct GroupResponse {
    pub id: String,
    pub realm_id: String,
    pub name: String,
    pub description: String,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}
impl From<domain::Group> for GroupResponse {
    fn from(a: domain::Group) -> Self {
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