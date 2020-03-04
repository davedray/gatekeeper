use chrono::{DateTime, Utc};
use domain::{NewUser, Repository, SuspendUser, BanUser, ChangeUserPassword, ChangeUsername};
use serde::{Deserialize, Serialize};
use uuid::Uuid;

use crate::errors::Error;
use crate::handlers::realms::responses::{UserResponse, UsersResponse};
use crate::server::AppState;

#[derive(Serialize, Deserialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct AddRealmUserRequest {
    pub username: String,
    pub password: String,
    pub suspended_until: Option<DateTime<Utc>>,
}

impl From<AddRealmUserRequest> for NewUser {
    fn from(a: AddRealmUserRequest) -> NewUser {
        NewUser {
            username: a.username,
            password: a.password,
            suspended_until: None,
        }
    }
}

pub async fn create(
    id: Uuid,
    form: AddRealmUserRequest,
    state: AppState,
) -> Result<impl warp::Reply, warp::Rejection> {
    let repository = &state.repository;
    let realm = repository.get_realm(id).map_err(|e| {
        warp::reject::custom(Error::from(e))
    })?;
    let update = realm.add_user(form.into());
    let user = repository.create_realm_user(update).map_err(|e| {
        warp::reject::custom(Error::from(e))
    })?;
    Ok(warp::reply::json( &UserResponse::from(user)))
}

#[derive(Serialize, Deserialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct SuspendUserRequest {
    pub id: Option<Uuid>,
    pub suspended_until: Option<DateTime<Utc>>,
}

impl From<SuspendUserRequest> for SuspendUser {
    fn from(a: SuspendUserRequest) -> SuspendUser {
        SuspendUser {
            id: a.id.unwrap(),
            suspended_until: a.suspended_until,
        }
    }
}

pub async fn suspend_user(
    id: Uuid,
    mut form: SuspendUserRequest,
    state: AppState,
) -> Result<impl warp::Reply, warp::Rejection> {
    form.id = Some(id);
    let repository = &state.repository;
    let user = repository.user_update_suspended(form.into()).map_err(|e| {
        warp::reject::custom(Error::from(e))
    })?;
    Ok(warp::reply::json( &UserResponse::from(user)))
}

pub async fn ban_user(
    id: Uuid,
    state: AppState,
) -> Result<impl warp::Reply, warp::Rejection> {
    let repository = &state.repository;
    let user = repository.user_update_banned(BanUser{ id, banned: true }).map_err(|e| {
        warp::reject::custom(Error::from(e))
    })?;
    Ok(warp::reply::json( &UserResponse::from(user)))
}

pub async fn unban_user(
    id: Uuid,
    state: AppState,
) -> Result<impl warp::Reply, warp::Rejection> {
    let repository = &state.repository;
    let user = repository.user_update_banned(BanUser{ id, banned: false }).map_err(|e| {
        warp::reject::custom(Error::from(e))
    })?;
    Ok(warp::reply::json( &UserResponse::from(user)))
}

#[derive(Serialize, Deserialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct ChangeUserPasswordRequest {
    pub id: Option<Uuid>,
    pub password: String
}

impl From<ChangeUserPasswordRequest> for ChangeUserPassword {
    fn from(a: ChangeUserPasswordRequest) -> ChangeUserPassword {
        ChangeUserPassword {
            id: a.id.unwrap(),
            password: a.password
        }
    }
}

pub async fn update_password(
    id: Uuid,
    mut form: ChangeUserPasswordRequest,
    state: AppState,
) -> Result<impl warp::Reply, warp::Rejection> {
    form.id = Some(id);
    let repository = &state.repository;
    let user = repository.user_update_password(form.into()).map_err(|e| {
        warp::reject::custom(Error::from(e))
    })?;
    Ok(warp::reply::json( &UserResponse::from(user)))
}

#[derive(Serialize, Deserialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct ChangeUsernameRequest {
    pub id: Option<Uuid>,
    pub username: String
}

impl From<ChangeUsernameRequest> for ChangeUsername {
    fn from(a: ChangeUsernameRequest) -> ChangeUsername {
        ChangeUsername {
            id: a.id.unwrap(),
            username: a.username,
        }
    }
}

pub async fn update_username(
    id: Uuid,
    mut form: ChangeUsernameRequest,
    state: AppState,
) -> Result<impl warp::Reply, warp::Rejection> {
    form.id = Some(id);
    let repository = &state.repository;
    let user = repository.user_update_username(form.into()).map_err(|e| {
        warp::reject::custom(Error::from(e))
    })?;
    Ok(warp::reply::json( &UserResponse::from(user)))
}

pub async fn delete_user(id: Uuid, state: AppState) -> Result<impl warp::Reply, warp::Rejection> {
    let repository = &state.repository;
    let err = repository.delete_user(id);
    match err {
        Some(_) => Err(warp::reject()),
        None => Ok(warp::reply::reply()),
    }
}

pub async fn list_users(realm: Uuid, state: AppState) -> Result<impl warp::Reply, warp::Rejection> {
    let repository = &state.repository;
    let users = repository.list_realm_users(realm)
        .map_err(|e| Error::from(e));
    match users {
        Ok(users) => Ok(warp::reply::json(&UsersResponse::from(users))),
        Err(e) => Err(warp::reject::custom(e))
    }
}
