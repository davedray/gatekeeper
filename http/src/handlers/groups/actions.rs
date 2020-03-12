use domain::{Repository};
use uuid::Uuid;

use crate::errors::Error;
use crate::server::AppState;

pub async fn add_user_to_group(
    group_id: Uuid,
    user_id: Uuid,
    state: AppState,
) -> Result<impl warp::Reply, warp::Rejection> {
    let repository = &state.repository;
    let group = repository.get_group(group_id).map_err(|err| warp::reject::custom(Error::from(err)) )?;
    let user = repository.get_realm_user(group.realm_id(), user_id).map_err(|err| warp::reject::custom(Error::from(err)) )?;
    let update = group.add_user(user).map_err(|err| warp::reject::custom(Error::from(err)) )?;
    let err = repository.create_group_user(update);
    match err {
        Some(err) => Err(warp::reject::custom(Error::from(err))),
        None => Ok(warp::reply::reply())
    }
}

pub async fn remove_user_from_group(
    group_id: Uuid,
    user_id: Uuid,
    state: AppState,
) -> Result<impl warp::Reply, warp::Rejection> {
    let repository = &state.repository;
    let group = repository.get_group(group_id).map_err(|err| warp::reject::custom(Error::from(err)) )?;
    let user = repository.get_realm_user(group.realm_id(), user_id).map_err(|err| warp::reject::custom(Error::from(err)) )?;
    let update = group.remove_user(user).map_err(|err| warp::reject::custom(Error::from(err)) )?;
    let err = repository.delete_group_user(update);
    match err {
        Some(err) => Err(warp::reject::custom(Error::from(err))),
        None => Ok(warp::reply::reply())
    }
}

pub async fn add_role_to_group(
    group_id: Uuid,
    role_id: Uuid,
    state: AppState,
) -> Result<impl warp::Reply, warp::Rejection> {
    let repository = &state.repository;
    let role = repository.get_role(role_id).map_err(|err| warp::reject::custom(Error::from(err)) )?;
    let group = repository.get_group(group_id).map_err(|err| warp::reject::custom(Error::from(err)) )?;
    let update = group.add_role(role).map_err(|err| warp::reject::custom(Error::from(err)) )?;
    let err = repository.create_group_role(update);
    match err {
        Some(err) => Err(warp::reject::custom(Error::from(err))),
        None => Ok(warp::reply::reply())
    }
}

pub async fn remove_role_from_group(
    group_id: Uuid,
    role_id: Uuid,
    state: AppState,
) -> Result<impl warp::Reply, warp::Rejection> {
    let repository = &state.repository;
    let role = repository.get_role(role_id).map_err(|err| warp::reject::custom(Error::from(err)) )?;
    let group = repository.get_group(group_id).map_err(|err| warp::reject::custom(Error::from(err)) )?;
    let update = group.remove_role(role).map_err(|err| warp::reject::custom(Error::from(err)) )?;
    let err = repository.delete_group_role(update);
    match err {
        Some(err) => Err(warp::reject::custom(Error::from(err))),
        None => Ok(warp::reply::reply())
    }
}