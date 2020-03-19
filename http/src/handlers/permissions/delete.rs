use uuid::Uuid;
use crate::server::AppState;
use domain::Repository;

pub async fn delete(id: Uuid, state: AppState) -> Result<impl warp::Reply, warp::Rejection> {
    let repository = &state.repository;
    let err = repository.delete_permission(id);
    match err {
        Some(_) => Err(warp::reject()),
        None => Ok(warp::reply::reply()),
    }
}