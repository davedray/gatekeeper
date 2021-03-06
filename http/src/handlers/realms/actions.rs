use chrono::{DateTime, Utc};
use domain::{NewUser, NewGroup, NewRole, NewPermission, Repository};
use serde::{Deserialize, Serialize};
use uuid::Uuid;

use crate::errors::Error;
use crate::handlers::realms::responses::UserResponse;
use crate::handlers::groups::responses::GroupResponse;
use crate::handlers::roles::responses::RoleResponse;
use crate::handlers::permissions::responses::PermissionResponse;
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

pub async fn create_user(
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
pub struct AddGroupRequest {
    pub name: String,
    pub description: String,
}

impl From<AddGroupRequest> for NewGroup {
    fn from(a: AddGroupRequest) -> NewGroup {
        NewGroup {
            name: a.name,
            description: a.description,
        }
    }
}

pub async fn create_group(
    id: Uuid,
    form: AddGroupRequest,
    state: AppState,
) -> Result<impl warp::Reply, warp::Rejection> {
    let repository = &state.repository;
    let realm = repository.get_realm(id).map_err(|e| {
        warp::reject::custom(Error::from(e))
    })?;
    let update = realm.add_group(form.into());
    let group = repository.create_realm_group(update).map_err(|e| {
        warp::reject::custom(Error::from(e))
    })?;
    Ok(warp::reply::json( &GroupResponse::from(group)))
}

#[derive(Serialize, Deserialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct AddRoleRequest {
    pub name: String,
    pub description: String,
}

impl From<AddRoleRequest> for NewRole {
    fn from(a: AddRoleRequest) -> NewRole {
        NewRole {
            name: a.name,
            description: a.description,
        }
    }
}

pub async fn create_role(
    id: Uuid,
    form: AddRoleRequest,
    state: AppState,
) -> Result<impl warp::Reply, warp::Rejection> {
    let repository = &state.repository;
    let realm = repository.get_realm(id).map_err(|e| {
        warp::reject::custom(Error::from(e))
    })?;
    let update = realm.add_role(form.into());
    let role = repository.create_realm_role(update).map_err(|e| {
        warp::reject::custom(Error::from(e))
    })?;
    Ok(warp::reply::json( &RoleResponse::from(role)))
}

#[derive(Serialize, Deserialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct AddPermissionRequest {
    pub name: String,
    pub description: String,
}

impl From<AddPermissionRequest> for NewPermission {
    fn from(a: AddPermissionRequest) -> NewPermission {
        NewPermission {
            name: a.name,
            description: a.description,
        }
    }
}

pub async fn create_permission(
    id: Uuid,
    form: AddPermissionRequest,
    state: AppState,
) -> Result<impl warp::Reply, warp::Rejection> {
    let repository = &state.repository;
    let realm = repository.get_realm(id).map_err(|e| {
        warp::reject::custom(Error::from(e))
    })?;
    let update = realm.add_permission(form.into());
    let permission = repository.create_realm_permission(update).map_err(|e| {
        warp::reject::custom(Error::from(e))
    })?;
    Ok(warp::reply::json( &PermissionResponse::from(permission)))
}
