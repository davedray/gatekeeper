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
