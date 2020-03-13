/// All possible Gatekeeper domain errors
#[derive(Debug)]
pub enum Error {
    Database(String),
    DuplicateRealm(String),
    LoginFailure,
    UserNotInGroupsRealm,
    UserNotInRolesRealm,
    RoleNotInGroupsRealm,
}

impl std::fmt::Display for Error {
    fn fmt(&self, f: &mut std::fmt::Formatter) -> std::fmt::Result {
        match *self {
            Error::Database(ref msg) => write!(f, "Database: {}", msg),
            Error::DuplicateRealm(ref msg) => write!(f, "Duplicate Realm: {}", msg),
            Error::LoginFailure => write!(f, "Login Failure: This username / password combination does not exist"),
            Error::UserNotInGroupsRealm => write!(f, "Error: This user doesn't belong to the same realm as this group"),
            Error::UserNotInRolesRealm => write!(f, "Error: This user doesn't belong to the same realm as this role"),
            Error::RoleNotInGroupsRealm => write!(f, "Error: This role doesn't belong to the same realm as this group"),
        }
    }
}

impl std::error::Error for Error {}
