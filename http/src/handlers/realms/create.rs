use crate::errors::Error;
use crate::handlers::realms::responses::RealmResponse;
use crate::server::AppState;
use domain::{NewRealm, Repository};
use serde::{Deserialize, Serialize};
#[derive(Serialize, Deserialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct NewRealmRequest {
    pub name: String,
    pub description: String,
    pub enabled: bool,
}

impl From<NewRealmRequest> for NewRealm {
    fn from(a: NewRealmRequest) -> NewRealm {
        NewRealm {
            name: a.name,
            description: a.description,
            enabled: a.enabled,
        }
    }
}

pub async fn create(
    form: NewRealmRequest,
    state: AppState,
) -> Result<impl warp::Reply, warp::Rejection> {
    let repository = &state.repository;

    let realm = repository.create_realm(form.into());
    match realm {
        Ok(realm) => {
            let response: RealmResponse = RealmResponse::from(realm);
            Ok(warp::reply::json(&response))
        }
        Err(e) => Err(warp::reject::custom(Error::from(e))),
    }
}
