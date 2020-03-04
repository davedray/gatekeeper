use crate::handlers::realms::responses::RealmsResponse;
use crate::server::AppState;
use domain::Repository;

pub async fn list(state: AppState) -> Result<impl warp::Reply, warp::Rejection> {
    let repository = &state.repository;

    let realms = repository.list_realms();
    match realms {
        Ok(realms) => {
            let response: RealmsResponse = RealmsResponse::from(realms);
            Ok(warp::reply::json(&response))
        }
        Err(_) => Err(warp::reject()),
    }
}
