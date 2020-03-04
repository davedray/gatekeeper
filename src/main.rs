use db::{connection::Postgres, Repository};
use dotenv::dotenv;
use http::server;
use std::env;
use std::net::SocketAddr;

const APPLICATION_NAME: &str = env!("CARGO_PKG_NAME");

#[derive(Clone)]
pub struct AppState {
    pub repository: Repository,
}

#[tokio::main]
async fn main() {
    dotenv().ok();
    let database_url = env::var("DATABASE_URL").expect("DATABASE_URL must be set");
    let repository = Repository(Postgres::new(&database_url));
    println!("Starting {}...", APPLICATION_NAME);
    let bind_address: SocketAddr = env::var("BIND_ADDRESS")
        .expect("BIND_ADDRESS is not set")
        .parse()
        .expect("BIND_ADDRESS is invalid");

    server::start(bind_address, repository).await;
}
