use domain::Repository;
use uuid::Uuid;

use crate::errors::Error;
use crate::server::AppState;
use crate::handlers::users::responses::RelatedIds;
use super::responses::GroupsResponse;

pub async fn list(realm: Uuid, state: AppState) -> Result<impl warp::Reply, warp::Rejection> {
    let repository = &state.repository;
    let groups = repository.list_realm_groups(realm)
        .map_err(|e| Error::from(e));
    match groups {
        Ok(groups) => Ok(warp::reply::json(&GroupsResponse::from(groups))),
        Err(e) => Err(warp::reject::custom(e))
    }
}

pub async fn in_role(role: Uuid, state: AppState) -> Result<impl warp::Reply, warp::Rejection> {
    let repository = &state.repository;
    let groups = repository.group_ids_by_role(role)
        .map_err(|e| Error::from(e));
    match groups {
        Ok(users) => Ok(warp::reply::json(&RelatedIds{
            count: users.len() as u64,
            ids: users,
        })),
        Err(e) => Err(warp::reject::custom(e))
    }
}