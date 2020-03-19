use domain::{Repository, UpdatePermission};
use serde::{Deserialize, Serialize};
use uuid::Uuid;

use crate::errors::Error;
use crate::server::AppState;
use crate::handlers::permissions::responses::PermissionResponse;

#[derive(Serialize, Deserialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct UpdatePermissionRequest {
    pub id: Option<Uuid>,
    pub name: Option<String>,
    pub description: Option<String>,
}

impl From<UpdatePermissionRequest> for UpdatePermission {
    fn from(a: UpdatePermissionRequest) -> UpdatePermission {
        UpdatePermission {
            id: a.id.unwrap(),
            name: a.name,
            description: a.description
        }
    }
}

pub async fn update(
    id: Uuid,
    mut form: UpdatePermissionRequest,
    state: AppState,
) -> Result<impl warp::Reply, warp::Rejection> {
    form.id = Some(id);
    let repository = &state.repository;
    let permission = repository.update_permission(form.into()).map_err(|e| {
        warp::reject::custom(Error::from(e))
    })?;
    Ok(warp::reply::json( &PermissionResponse::from(permission)))
}