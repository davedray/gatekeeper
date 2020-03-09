use domain::{Repository, UpdateGroup};
use serde::{Deserialize, Serialize};
use uuid::Uuid;

use crate::errors::Error;
use crate::server::AppState;
use crate::handlers::groups::responses::GroupResponse;

#[derive(Serialize, Deserialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct UpdateGroupRequest {
    pub id: Option<Uuid>,
    pub name: Option<String>,
    pub description: Option<String>,
}

impl From<UpdateGroupRequest> for UpdateGroup {
    fn from(a: UpdateGroupRequest) -> UpdateGroup {
        UpdateGroup {
            id: a.id.unwrap(),
            name: a.name,
            description: a.description
        }
    }
}

pub async fn update(
    id: Uuid,
    mut form: UpdateGroupRequest,
    state: AppState,
) -> Result<impl warp::Reply, warp::Rejection> {
    form.id = Some(id);
    let repository = &state.repository;
    let group = repository.update_group(form.into()).map_err(|e| {
        warp::reject::custom(Error::from(e))
    })?;
    Ok(warp::reply::json( &GroupResponse::from(group)))
}