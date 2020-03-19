use domain::Repository;
use uuid::Uuid;

use crate::errors::Error;
use crate::server::AppState;

use super::responses::{UsersResponse, RelatedIds};

pub async fn list(realm: Uuid, state: AppState) -> Result<impl warp::Reply, warp::Rejection> {
    let repository = &state.repository;
    let users = repository.list_realm_users(realm)
        .map_err(|e| Error::from(e));
    match users {
        Ok(users) => Ok(warp::reply::json(&UsersResponse::from(users))),
        Err(e) => Err(warp::reject::custom(e))
    }
}

pub async fn in_group(group: Uuid, state: AppState) -> Result<impl warp::Reply, warp::Rejection> {
    let repository = &state.repository;
    let users = repository.user_ids_by_group(group)
        .map_err(|e| Error::from(e));
    match users {
        Ok(users) => Ok(warp::reply::json(&RelatedIds{
            count: users.len() as u64,
            ids: users,
        })),
        Err(e) => Err(warp::reject::custom(e))
    }
}

pub async fn in_role(role: Uuid, state: AppState) -> Result<impl warp::Reply, warp::Rejection> {
    let repository = &state.repository;
    let users = repository.user_ids_by_role(role)
        .map_err(|e| Error::from(e));
    match users {
        Ok(users) => Ok(warp::reply::json(&RelatedIds{
            count: users.len() as u64,
            ids: users,
        })),
        Err(e) => Err(warp::reject::custom(e))
    }
}

pub async fn with_permission(permission: Uuid, state: AppState) -> Result<impl warp::Reply, warp::Rejection> {
    let repository = &state.repository;
    let groups = repository.user_ids_by_permission(permission)
        .map_err(|e| Error::from(e));
    match groups {
        Ok(groups) => Ok(warp::reply::json(&RelatedIds{
            count: groups.len() as u64,
            ids: groups,
        })),
        Err(e) => Err(warp::reject::custom(e))
    }
}