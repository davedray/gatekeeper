use domain::{User};
use uuid::Uuid;
use serde::{Deserialize, Serialize};
use crate::errors::Error;
use crate::server::AppState;

use super::responses::UserResponse;

#[derive(Serialize, Deserialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct LoginRequest {
    pub username: String,
    pub password: String
}

impl From<LoginRequest> for domain::LoginUser {
    fn from(a: LoginRequest) -> domain::LoginUser {
        domain::LoginUser {
            username: a.username,
            password: a.password
        }
    }
}

pub async fn login(realm: Uuid, form: LoginRequest, state: AppState) -> Result<impl warp::Reply, warp::Rejection> {
    let repository= &state.repository;
    let user = User::login(realm, form.into(), repository).map_err(|e| {
        warp::reject::custom(Error::from(e))
    })?;
    if let Some(suspended_until) = user.suspended_until {
        return Err(warp::reject::custom(Error::Unauthorized(format!("Suspended until {}", suspended_until).into())));
    }
    if user.banned {
        return Err(warp::reject::custom(Error::Unauthorized("Banned".into())));
    }
    Ok(warp::reply::json( &UserResponse::from(user)))
}
