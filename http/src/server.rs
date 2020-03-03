use std::net::SocketAddr;
use warp::{self, Filter};
use db::{Repository};
use crate::routes;

#[derive(Clone)]
pub struct AppState {
    pub repository: Repository,
}

pub async fn start(bind_address: SocketAddr, repository: Repository) {
    let app_state = AppState {
        repository,
    };
    let routes = routes::routes(app_state).with(warp::log("http"));
    println!("You can access the server at {}", bind_address);
    warp::serve(routes).run(bind_address).await;
}