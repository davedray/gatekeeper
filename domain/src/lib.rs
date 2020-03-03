pub mod repository;
pub mod realms;
pub mod errors;

pub use realms::*;
pub use errors::*;
pub use repository::*;

#[cfg(test)]
mod tests {
    #[test]
    fn it_works() {
        assert_eq!(2 + 2, 4);
    }
}
