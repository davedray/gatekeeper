/// All possible Gatekeeper domain errors
#[derive(Debug)]
pub enum Error {
    Database(String),
    DuplicateRealm(String),
    LoginFailure,
}

impl std::fmt::Display for Error {
    fn fmt(&self, f: &mut std::fmt::Formatter) -> std::fmt::Result {
        match *self {
            Error::Database(ref msg) => write!(f, "Database: {}", msg),
            Error::DuplicateRealm(ref msg) => write!(f, "Duplicate Realm: {}", msg),
            Error::LoginFailure => write!(f, "Login Failure: This username / password combination does not exist"),
        }
    }
}

impl std::error::Error for Error {}
