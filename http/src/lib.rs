pub mod server;
mod routes;
mod handlers;
mod errors;
#[cfg(test)]
mod tests {
    #[test]
    fn it_works() {
        assert_eq!(2 + 2, 4);
    }
}
