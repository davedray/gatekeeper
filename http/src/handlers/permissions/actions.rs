use domain::{Repository};
use uuid::Uuid;

use crate::errors::Error;
use crate::server::AppState;

pub async fn add_permission_to_user(
    permission_id: Uuid,
    user_id: Uuid,
    state: AppState,
) -> Result<impl warp::Reply, warp::Rejection> {
    let repository = &state.repository;
    let permission = repository.get_permission(permission_id).map_err(|err| warp::reject::custom(Error::from(err)) )?;
    let user = repository.get_realm_user(permission.realm_id(), user_id).map_err(|err| warp::reject::custom(Error::from(err)) )?;
    let update = permission.add_user(user).map_err(|err| warp::reject::custom(Error::from(err)) )?;
    let err = repository.create_user_permission(update);
    match err {
        Some(err) => Err(warp::reject::custom(Error::from(err))),
        None => Ok(warp::reply::reply())
    }
}

pub async fn remove_permission_from_user(
    permission_id: Uuid,
    user_id: Uuid,
    state: AppState,
) -> Result<impl warp::Reply, warp::Rejection> {
    let repository = &state.repository;
    let permission = repository.get_permission(permission_id).map_err(|err| warp::reject::custom(Error::from(err)) )?;
    let user = repository.get_realm_user(permission.realm_id(), user_id).map_err(|err| warp::reject::custom(Error::from(err)) )?;
    let update = permission.remove_user(user).map_err(|err| warp::reject::custom(Error::from(err)) )?;
    let err = repository.delete_user_permission(update);
    match err {
        Some(err) => Err(warp::reject::custom(Error::from(err))),
        None => Ok(warp::reply::reply())
    }
}

pub async fn add_permission_to_role(
    permission_id: Uuid,
    role_id: Uuid,
    state: AppState,
) -> Result<impl warp::Reply, warp::Rejection> {
    let repository = &state.repository;
    let role = repository.get_role(role_id).map_err(|err| warp::reject::custom(Error::from(err)) )?;
    let permission = repository.get_permission(permission_id).map_err(|err| warp::reject::custom(Error::from(err)) )?;
    let update = permission.add_role(role).map_err(|err| warp::reject::custom(Error::from(err)) )?;
    let err = repository.create_role_permission(update);
    match err {
        Some(err) => Err(warp::reject::custom(Error::from(err))),
        None => Ok(warp::reply::reply())
    }
}

pub async fn remove_permission_from_role(
    permission_id: Uuid,
    role_id: Uuid,
    state: AppState,
) -> Result<impl warp::Reply, warp::Rejection> {
    let repository = &state.repository;
    let role = repository.get_role(role_id).map_err(|err| warp::reject::custom(Error::from(err)) )?;
    let permission = repository.get_permission(permission_id).map_err(|err| warp::reject::custom(Error::from(err)) )?;
    let update = permission.remove_role(role).map_err(|err| warp::reject::custom(Error::from(err)) )?;
    let err = repository.delete_role_permission(update);
    match err {
        Some(err) => Err(warp::reject::custom(Error::from(err))),
        None => Ok(warp::reply::reply())
    }
}

pub async fn add_permission_to_group(
    permission_id: Uuid,
    group_id: Uuid,
    state: AppState,
) -> Result<impl warp::Reply, warp::Rejection> {
    let repository = &state.repository;
    let group = repository.get_group(group_id).map_err(|err| warp::reject::custom(Error::from(err)) )?;
    let permission = repository.get_permission(permission_id).map_err(|err| warp::reject::custom(Error::from(err)) )?;
    let update = permission.add_group(group).map_err(|err| warp::reject::custom(Error::from(err)) )?;
    let err = repository.create_group_permission(update);
    match err {
        Some(err) => Err(warp::reject::custom(Error::from(err))),
        None => Ok(warp::reply::reply())
    }
}

pub async fn remove_permission_from_group(
    permission_id: Uuid,
    group_id: Uuid,
    state: AppState,
) -> Result<impl warp::Reply, warp::Rejection> {
    let repository = &state.repository;
    let group = repository.get_group(group_id).map_err(|err| warp::reject::custom(Error::from(err)) )?;
    let permission = repository.get_permission(permission_id).map_err(|err| warp::reject::custom(Error::from(err)) )?;
    let update = permission.remove_group(group).map_err(|err| warp::reject::custom(Error::from(err)) )?;
    let err = repository.delete_group_permission(update);
    match err {
        Some(err) => Err(warp::reject::custom(Error::from(err))),
        None => Ok(warp::reply::reply())
    }
}