use warp::{self, Filter};
use crate::server::AppState;
use crate::handlers;
use uuid::Uuid;
pub fn routes(
    state: AppState,
) -> impl Filter<Extract = impl warp::Reply, Error = std::convert::Infallible> + Clone {
    warp::path::end()
        .map(handlers::index::index)
        .or(warp::path!("api" / "realms")
            .and(warp::get())
            .and(with_state(state.clone()))
            .and_then(handlers::realms::list::list))
        .or(warp::path!("api" / "realms")
            .and(warp::post())
            .and(warp::body::json())
            .and(with_state(state.clone()))
            .and_then(handlers::realms::create::create))
        .or(warp::path!("api" / "realms" / Uuid)
            .and(warp::put())
            .and(warp::body::json())
            .and(with_state(state.clone()))
            .and_then(handlers::realms::update::update))
        .or(warp::path!("api" / "realms" / Uuid)
            .and(warp::delete())
            .and(with_state(state.clone()))
            .and_then(handlers::realms::delete::delete))
        .recover(crate::errors::handle_rejection)
}

fn with_state(
    state: AppState,
) -> impl Filter<Extract = (AppState,), Error = std::convert::Infallible> + Clone {
    warp::any().map(move || state.clone())
}