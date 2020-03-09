use chrono::{DateTime, Utc};
use uuid::Uuid;
use crate::{Repository, Error};

pub struct User {
    id: Uuid,
    realm_id: Uuid,
    pub username: String,
    pub banned: bool,
    pub suspended_until: Option<DateTime<Utc>>,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

pub struct NewUser {
    pub username: String,
    pub password: String,
    pub suspended_until: Option<DateTime<Utc>>,
}

pub struct ChangeUserPassword {
    pub id: Uuid,
    pub password: String
}

pub struct UpdateUser {
    pub id: Uuid,
    pub username: Option<String>,
    pub banned: Option<bool>,
    pub suspended_until: Option<DateTime<Utc>>,
}

pub struct LoginUser {
    pub username: String,
    pub password: String,
}

impl User {
    pub fn id(&self) -> Uuid {
        self.id
    }
    pub fn realm_id(&self) -> Uuid {
        self.realm_id
    }
    pub fn new(
        id: Uuid,
        realm_id: Uuid,
        username: String,
        banned: bool,
        suspended_until: Option<DateTime<Utc>>,
        created_at: DateTime<Utc>,
        updated_at: DateTime<Utc>,
    ) -> Self {
        Self {
            id,
            realm_id,
            username,
            banned,
            suspended_until,
            created_at,
            updated_at,
        }
    }

    pub fn login(
        realm_id: Uuid,
        login: LoginUser,
        repo: &impl Repository
    ) -> Result<Self, Error> {
        repo.find_realm_user_by_username_password(realm_id, login)
    }
}
