#[macro_use]
extern crate diesel;
pub use connection::Postgres;

pub mod connection;
pub mod models;
pub mod repository;
pub mod schema;
pub mod queries;
pub use repository::Repository;
#[cfg(test)]
mod tests {
    #[test]
    fn it_works() {
        assert_eq!(2 + 2, 4);
    }
}

pub fn test() {
    println!("Hello, world!");
}
