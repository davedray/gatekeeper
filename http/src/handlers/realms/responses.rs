use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct RealmsResponse {
    pub realms: Vec<RealmResponse>,
    pub count: u64,
}

impl<T: Into<RealmResponse>> From<Vec<T>> for RealmsResponse {
    fn from(realms: Vec<T>) -> Self {
        let count = realms.len() as u64;
        let realms = realms.into_iter().map(|r| r.into()).collect();
        Self { realms, count }
    }
}

#[derive(Serialize, Deserialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct RealmResponse {
    pub id: String,
    pub name: String,
    pub description: String,
    pub enabled: bool,
}

impl From<domain::Realm> for RealmResponse {
    fn from(a: domain::Realm) -> Self {
        Self {
            id: a.id().to_string(),
            name: a.name,
            description: a.description,
            enabled: a.enabled,
        }
    }
}

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
