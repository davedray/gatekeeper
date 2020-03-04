use crate::handlers::realms::responses::RealmResponse;
use crate::server::AppState;
use domain::{Repository, UpdateRealm};
use serde::{Deserialize, Serialize};
use uuid::Uuid;

#[derive(Serialize, Deserialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct UpdateRealmRequest {
    pub id: Option<Uuid>,
    pub name: String,
    pub description: String,
    pub enabled: bool,
}

impl From<UpdateRealmRequest> for UpdateRealm {
    fn from(a: UpdateRealmRequest) -> UpdateRealm {
        UpdateRealm {
            id: a.id.unwrap(),
            name: a.name,
            description: a.description,
            enabled: a.enabled,
        }
    }
}

pub async fn update(
    id: Uuid,
    mut form: UpdateRealmRequest,
    state: AppState,
) -> Result<impl warp::Reply, warp::Rejection> {
    let repository = &state.repository;
    form.id = Some(id);
    let request: UpdateRealm = form.into();
    let realm = repository.update_realm(request);
    match realm {
        Ok(realm) => {
            let response: RealmResponse = RealmResponse::from(realm);
            Ok(warp::reply::json(&response))
        }
        Err(_) => Err(warp::reject()),
    }
}
