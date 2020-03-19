use domain::Repository;
use uuid::Uuid;

use crate::errors::Error;
use crate::server::AppState;
use crate::handlers::users::responses::RelatedIds;
use super::responses::PermissionsResponse;

pub async fn list(realm: Uuid, state: AppState) -> Result<impl warp::Reply, warp::Rejection> {
    let repository = &state.repository;
    let permissions = repository.list_realm_permissions(realm)
        .map_err(|e| Error::from(e));
    match permissions {
        Ok(permissions) => Ok(warp::reply::json(&PermissionsResponse::from(permissions))),
        Err(e) => Err(warp::reject::custom(e))
    }
}

pub async fn in_role(role: Uuid, state: AppState) -> Result<impl warp::Reply, warp::Rejection> {
    let repository = &state.repository;
    let permissions = repository.permission_ids_by_role(role)
        .map_err(|e| Error::from(e));
    match permissions {
        Ok(users) => Ok(warp::reply::json(&RelatedIds{
            count: users.len() as u64,
            ids: users,
        })),
        Err(e) => Err(warp::reject::custom(e))
    }
}

pub async fn with_user(user: Uuid, state: AppState) -> Result<impl warp::Reply, warp::Rejection> {
    let repository = &state.repository;
    let permissions = repository.permission_ids_by_user(user)
        .map_err(|e| Error::from(e));
    match permissions {
        Ok(permissions) => Ok(warp::reply::json(&RelatedIds{
            count: permissions.len() as u64,
            ids: permissions,
        })),
        Err(e) => Err(warp::reject::custom(e))
    }
}

pub async fn in_group(group: Uuid, state: AppState) -> Result<impl warp::Reply, warp::Rejection> {
    let repository = &state.repository;
    let permissions = repository.permission_ids_by_group(group)
        .map_err(|e| Error::from(e));
    match permissions {
        Ok(users) => Ok(warp::reply::json(&RelatedIds{
            count: users.len() as u64,
            ids: users,
        })),
        Err(e) => Err(warp::reject::custom(e))
    }
}