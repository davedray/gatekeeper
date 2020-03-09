use chrono::{DateTime, Utc};
use data_encoding::BASE64;
use diesel::{AsChangeset, Insertable, Queryable};
use ring::digest::{digest, SHA256};
use ring::{rand, rand::SecureRandom};
use serde::{Deserialize, Serialize};
use uuid::Uuid;

use crate::models::Realm;
use crate::schema::users;

#[derive(Insertable, Serialize, Deserialize, PartialEq, Debug, Clone)]
#[table_name = "users"]
pub struct NewUser {
    pub id: Uuid,
    pub realm_id: Uuid,
    pub username: String,
    pub password_salt: String,
    pub password_hash: String,
    pub suspended_until: Option<DateTime<Utc>>,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

#[derive(Identifiable, Queryable, Associations, Serialize, Deserialize, PartialEq, Debug, Clone)]
#[belongs_to(Realm, foreign_key = "realm_id")]
pub struct User {
    pub id: Uuid,
    pub realm_id: Uuid,
    pub username: String,
    pub banned: bool,
    pub suspended_until: Option<DateTime<Utc>>,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

#[derive(Identifiable, Queryable, Serialize, Deserialize, PartialEq, Debug, Clone)]
#[table_name = "users"]
pub struct UserWithPassword {
    pub id: Uuid,
    pub realm_id: Uuid,
    pub username: String,
    pub password_salt: String,
    pub password_hash: String,
    pub banned: bool,
    pub suspended_until: Option<DateTime<Utc>>,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

impl UserWithPassword {
    pub fn check_password(&self, plaintext: String) -> bool {
        let check_hash = BASE64
            .encode(digest(&SHA256, (plaintext + self.password_salt.as_str()).as_bytes()).as_ref());
        return check_hash.eq(&self.password_hash);
    }
}

impl From<UserWithPassword> for domain::User {
    fn from(a: UserWithPassword) -> Self {
        domain::User::new(
            a.id,
            a.realm_id,
            a.username,
            a.banned,
            a.suspended_until,
            a.created_at,
            a.updated_at,
        )
    }
}
#[derive(AsChangeset)]
#[table_name = "users"]
pub struct UpdateUserPassword {
    pub id: Uuid,
    pub password_salt: String,
    pub password_hash: String,
    pub updated_at: DateTime<Utc>,
}

#[derive(AsChangeset)]
#[table_name = "users"]
pub struct UpdateUser {
    pub id: Uuid,
    pub username: Option<String>,
    pub banned: Option<bool>,
    pub suspended_until: Option<Option<DateTime<Utc>>>,
    pub updated_at: DateTime<Utc>,
}

impl From<User> for domain::User {
    fn from(a: User) -> Self {
        domain::User::new(
            a.id,
            a.realm_id,
            a.username,
            a.banned,
            a.suspended_until,
            a.created_at,
            a.updated_at,
        )
    }
}

impl User {
    pub fn from(a: domain::User) -> Self {
        Self {
            id: a.id(),
            realm_id: a.realm_id(),
            username: a.username,
            banned: a.banned,
            suspended_until: a.suspended_until,
            created_at: a.created_at,
            updated_at: a.updated_at,
        }
    }
}

impl From<NewUser> for User {
    fn from(a: NewUser) -> Self {
        Self {
            id: a.id,
            realm_id: a.realm_id,
            username: a.username,
            banned: false,
            suspended_until: a.suspended_until,
            created_at: a.created_at,
            updated_at: a.updated_at,
        }
    }
}

impl NewUser {
    pub fn from(a: domain::AddRealmUser) -> Self {
        let (password_salt, password_hash) = secure_password(a.password);
        NewUser {
            id: Uuid::new_v4(),
            realm_id: a.realm_id,
            username: a.username,
            password_hash,
            password_salt,
            suspended_until: a.suspended_until,
            created_at: Utc::now(),
            updated_at: Utc::now(),
        }
    }
}

impl UpdateUser {
    pub fn from(a: domain::UpdateUser) -> Self {
        Self {
            id: a.id,
            username: a.username,
            banned: a.banned,
            suspended_until: Option::from(a.suspended_until),
            updated_at: Utc::now(),
        }
    }
}

impl UpdateUserPassword {
    pub fn from(a: domain::ChangeUserPassword) -> Self {
        let (password_salt, password_hash) = secure_password(a.password);
        Self {
            id: a.id,
            password_salt,
            password_hash,
            updated_at: Utc::now(),
        }
    }
}

fn secure_password(plaintext: String) -> (String, String) {
    const CREDENTIAL_LEN: usize = 128 / 8;
    let rng = rand::SystemRandom::new();
    let mut salt = [0u8; CREDENTIAL_LEN];
    rng.fill(&mut salt).expect("Could not generate salt");
    let password_salt = BASE64.encode(&salt);
    let password_hash = BASE64
        .encode(digest(&SHA256, (plaintext + password_salt.as_str()).as_bytes()).as_ref());
    (password_salt, password_hash)
}