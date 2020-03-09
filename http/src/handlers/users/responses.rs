use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use uuid::Uuid;

#[derive(Serialize, Deserialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct UsersResponse {
    pub users: Vec<UserResponse>,
    pub count: u64,
}
impl<T: Into<UserResponse>> From<Vec<T>> for UsersResponse {
    fn from(users: Vec<T>) -> Self {
        let count = users.len() as u64;
        let users = users.into_iter().map(|r| r.into()).collect();
        Self { users, count }
    }
}
#[derive(Serialize, Deserialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct UserResponse {
    pub id: String,
    pub realm_id: String,
    pub username: String,
    pub suspended_until: Option<DateTime<Utc>>,
    pub banned: bool,
}
impl From<domain::User> for UserResponse {
    fn from(a: domain::User) -> Self {
        Self {
            id: a.id().to_string(),
            realm_id: a.realm_id().to_string(),
            username: a.username,
            suspended_until: a.suspended_until,
            banned: a.banned,
        }
    }
}

#[derive(Serialize, Deserialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct RelatedIds {
    pub ids: Vec<Uuid>,
    pub count: u64,
}