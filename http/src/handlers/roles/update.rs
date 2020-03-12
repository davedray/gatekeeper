use domain::{Repository, UpdateRole};
use serde::{Deserialize, Serialize};
use uuid::Uuid;

use crate::errors::Error;
use crate::server::AppState;
use crate::handlers::roles::responses::RoleResponse;

#[derive(Serialize, Deserialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct UpdateRoleRequest {
    pub id: Option<Uuid>,
    pub name: Option<String>,
    pub description: Option<String>,
}

impl From<UpdateRoleRequest> for UpdateRole {
    fn from(a: UpdateRoleRequest) -> UpdateRole {
        UpdateRole {
            id: a.id.unwrap(),
            name: a.name,
            description: a.description
        }
    }
}

pub async fn update(
    id: Uuid,
    mut form: UpdateRoleRequest,
    state: AppState,
) -> Result<impl warp::Reply, warp::Rejection> {
    form.id = Some(id);
    let repository = &state.repository;
    let role = repository.update_role(form.into()).map_err(|e| {
        warp::reject::custom(Error::from(e))
    })?;
    Ok(warp::reply::json( &RoleResponse::from(role)))
}