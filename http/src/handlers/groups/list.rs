use domain::Repository;
use uuid::Uuid;

use crate::errors::Error;
use crate::server::AppState;

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
