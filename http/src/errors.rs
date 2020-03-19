use serde_derive::Serialize;
use std::convert::Infallible;
use warp::{http::StatusCode, Rejection, Reply};
#[derive(Debug)]
pub enum Error {
    Database(String),
    DuplicateEntity(String),
    Unauthorized(String),
    BadRequest(String),
}

impl warp::reject::Reject for Error {}

/// An API error serializable to JSON.
#[derive(Serialize)]
struct ErrorMessage {
    error: String,
    code: u16,
    message: String,
}

// TODO: Map to JSON string with more descriptive output
pub async fn handle_rejection(err: Rejection) -> Result<impl Reply, Infallible> {
    let error;
    let code;
    let message;
    if err.is_not_found() {
        error = "Not Found";
        code = StatusCode::NOT_FOUND;
        message = "Resource Not Found";
    } else if let Some(Error::Database(e)) = err.find() {
        error = "Database Error";
        code = StatusCode::INTERNAL_SERVER_ERROR;
        message = e
    } else if let Some(Error::DuplicateEntity(e)) = err.find() {
        error = "Duplicate Entity";
        code = StatusCode::UNPROCESSABLE_ENTITY;
        message = e;
    } else if let Some(Error::Unauthorized(e)) = err.find() {
        error = "Unauthorized";
        code = StatusCode::UNAUTHORIZED;
        message = e;
    } else if let Some(Error::BadRequest(e)) = err.find() {
        error = "Bad Request";
        code = StatusCode::BAD_REQUEST;
        message = e;
    } else {
        error = "Unknown";
        code = StatusCode::INTERNAL_SERVER_ERROR;
        message = "Internal Server Error";
    }
    let json = warp::reply::json(&ErrorMessage {
        error: error.to_string(),
        code: code.as_u16(),
        message: message.into(),
    });
    Ok(warp::reply::with_status(json, code))
}

impl From<domain::Error> for Error {
    fn from(err: domain::Error) -> Self {
        match err {
            domain::Error::Database(msg) => Self::Database(msg),
            domain::Error::DuplicateRealm(msg) => {
                Self::DuplicateEntity(format!("A realm with the name {} already exists.", msg))
            },
            domain::Error::LoginFailure => {
                Self::Unauthorized(format!("This username / password combination does not exist"))
            },
            domain::Error::UserNotInGroupsRealm => {
                Self::BadRequest(format!("This user does not belong to this group's realm"))
            },
            domain::Error::UserNotInRolesRealm => {
                Self::BadRequest(format!("This user does not belong to this role's realm"))
            },
            domain::Error::RoleNotInGroupsRealm => {
                Self::BadRequest(format!("This role does not belong to this group's realm"))
            },
            domain::Error::RoleNotInPermissionsRealm => {
                Self::BadRequest(format!("This role does not belong to this permission's realm"))
            },
            domain::Error::UserNotInPermissionsRealm => {
                Self::BadRequest(format!("This user does not belong to this permission's realm"))
            },
            domain::Error::GroupNotInPermissionsRealm => {
                Self::BadRequest(format!("This group does not belong to this permission's realm"))
            }
        }
    }
}
