use domain::{Repository};
use uuid::Uuid;

use crate::errors::Error;
use crate::server::AppState;

pub async fn add_user_to_role(
    role_id: Uuid,
    user_id: Uuid,
    state: AppState,
) -> Result<impl warp::Reply, warp::Rejection> {
    let repository = &state.repository;
    let role = repository.get_role(role_id).map_err(|err| warp::reject::custom(Error::from(err)) )?;
    let user = repository.get_realm_user(role.realm_id(), user_id).map_err(|err| warp::reject::custom(Error::from(err)) )?;
    let update = role.add_user(user).map_err(|err| warp::reject::custom(Error::from(err)) )?;
    let err = repository.create_role_user(update);
    match err {
        Some(err) => Err(warp::reject::custom(Error::from(err))),
        None => Ok(warp::reply::reply())
    }
}

pub async fn remove_user_from_role(
    role_id: Uuid,
    user_id: Uuid,
    state: AppState,
) -> Result<impl warp::Reply, warp::Rejection> {
    let repository = &state.repository;
    let role = repository.get_role(role_id).map_err(|err| warp::reject::custom(Error::from(err)) )?;
    let user = repository.get_realm_user(role.realm_id(), user_id).map_err(|err| warp::reject::custom(Error::from(err)) )?;
    let update = role.remove_user(user).map_err(|err| warp::reject::custom(Error::from(err)) )?;
    let err = repository.delete_role_user(update);
    match err {
        Some(err) => Err(warp::reject::custom(Error::from(err))),
        None => Ok(warp::reply::reply())
    }
}