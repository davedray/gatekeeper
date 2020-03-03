use crate::server::AppState;
use domain::{Repository};
use uuid::Uuid;

pub async fn delete(
    id: Uuid,
    state: AppState,
) -> Result<impl warp::Reply, warp::Rejection> {
    let repository = &state.repository;
    let err = repository.delete_realm(id);
    match err {
        Some(_) => {
            Err(warp::reject())
        },
        None => {
            Ok(warp::reply::reply())
        }
    }

}