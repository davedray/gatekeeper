use domain::Repository;
use uuid::Uuid;

use crate::errors::Error;
use crate::server::AppState;
use crate::handlers::users::responses::RelatedIds;

use super::responses::RolesResponse;

pub async fn list(realm: Uuid, state: AppState) -> Result<impl warp::Reply, warp::Rejection> {
    let repository = &state.repository;
    let roles = repository.list_realm_roles(realm)
        .map_err(|e| Error::from(e));
    match roles {
        Ok(roles) => Ok(warp::reply::json(&RolesResponse::from(roles))),
        Err(e) => Err(warp::reject::custom(e))
    }
}

pub async fn in_group(group: Uuid, state: AppState) -> Result<impl warp::Reply, warp::Rejection> {
    let repository = &state.repository;
    let roles = repository.role_ids_by_group(group)
        .map_err(|e| Error::from(e));
    match roles {
        Ok(users) => Ok(warp::reply::json(&RelatedIds{
            count: users.len() as u64,
            ids: users,
        })),
        Err(e) => Err(warp::reject::custom(e))
    }
}

pub async fn with_user(user: Uuid, state: AppState) -> Result<impl warp::Reply, warp::Rejection> {
    let repository = &state.repository;
    let roles = repository.role_ids_with_user(user)
        .map_err(|e| Error::from(e));
    match roles {
        Ok(roles) => Ok(warp::reply::json(&RelatedIds{
            count: roles.len() as u64,
            ids: roles,
        })),
        Err(e) => Err(warp::reject::custom(e))
    }
}
