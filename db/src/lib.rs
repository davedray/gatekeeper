#[macro_use]
extern crate diesel;
extern crate data_encoding;
extern crate ring;
pub use connection::Postgres;

pub mod connection;
pub mod models;
pub mod queries;
pub mod repository;
pub mod schema;
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
