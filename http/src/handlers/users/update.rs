use chrono::{DateTime, Utc};
use domain::{ChangeUserPassword, Repository, UpdateUser};
use serde::{Deserialize, Serialize};
use uuid::Uuid;

use crate::errors::Error;
use super::responses::UserResponse;
use crate::server::AppState;

#[derive(Serialize, Deserialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct ChangeUsernameRequest {
    pub id: Option<Uuid>,
    pub username: String
}

impl From<ChangeUsernameRequest> for UpdateUser {
    fn from(a: ChangeUsernameRequest) -> UpdateUser {
        UpdateUser {
            id: a.id.unwrap(),
            username: Some(a.username),
            banned: None,
            suspended_until: None
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
    let user = repository.update_user(form.into()).map_err(|e| {
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

impl From<SuspendUserRequest> for UpdateUser {
    fn from(a: SuspendUserRequest) -> UpdateUser {
        UpdateUser {
            id: a.id.unwrap(),
            username: None,
            banned: None,
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
    let user = repository.update_user(form.into()).map_err(|e| {
        warp::reject::custom(Error::from(e))
    })?;
    Ok(warp::reply::json( &UserResponse::from(user)))
}

pub async fn ban_user(
    id: Uuid,
    state: AppState,
) -> Result<impl warp::Reply, warp::Rejection> {
    let repository = &state.repository;
    let user = repository.update_user(UpdateUser{
        id,
        username: None,
        banned: Some(true),
        suspended_until: None
    }).map_err(|e| {
        warp::reject::custom(Error::from(e))
    })?;
    Ok(warp::reply::json( &UserResponse::from(user)))
}

pub async fn unban_user(
    id: Uuid,
    state: AppState,
) -> Result<impl warp::Reply, warp::Rejection> {
    let repository = &state.repository;
    let user = repository.update_user(UpdateUser{
        id,
        username: None,
        banned: Some(false),
        suspended_until: None
    }).map_err(|e| {
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
    let user = repository.update_user_password(form.into()).map_err(|e| {
        warp::reject::custom(Error::from(e))
    })?;
    Ok(warp::reply::json( &UserResponse::from(user)))
}
