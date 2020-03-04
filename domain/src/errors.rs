/// All possible Gatekeeper domain errors
#[derive(Debug)]
pub enum Error {
    Database(String),
    DuplicateRealm(String),
}

impl std::fmt::Display for Error {
    fn fmt(&self, f: &mut std::fmt::Formatter) -> std::fmt::Result {
        match *self {
            Error::Database(ref msg) => write!(f, "Database: {}", msg),
            Error::DuplicateRealm(ref msg) => write!(f, "Duplicate Realm: {}", msg),
        }
    }
}

impl std::error::Error for Error {}
