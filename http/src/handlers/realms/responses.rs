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
        Self {
            realms,
            count,
        }
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
