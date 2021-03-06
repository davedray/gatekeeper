use crate::handlers;
use crate::server::AppState;
use uuid::Uuid;
use warp::{self, Filter};
pub fn routes(
    state: AppState,
) -> impl Filter<Extract = impl warp::Reply, Error = std::convert::Infallible> + Clone {
    warp::path::end()
        .map(handlers::index::index)
        .or(warp::path!("api" / "realms")
            .and(warp::get())
            .and(with_state(state.clone()))
            .and_then(handlers::realms::list::list))
        .or(warp::path!("api" / "realms")
            .and(warp::post())
            .and(warp::body::json())
            .and(with_state(state.clone()))
            .and_then(handlers::realms::create::create))
        .or(warp::path!("api" / "realms" / Uuid)
            .and(warp::put())
            .and(warp::body::json())
            .and(with_state(state.clone()))
            .and_then(handlers::realms::update::update))
        .or(warp::path!("api" / "realms" / Uuid)
            .and(warp::delete())
            .and(with_state(state.clone()))
            .and_then(handlers::realms::delete::delete))
        .or(warp::path!("api" / "realms" / Uuid / "users")
            .and(warp::post())
            .and(warp::body::json())
            .and(with_state(state.clone()))
            .and_then(handlers::realms::actions::create_user))
        .or(warp::path!("api" / "realms" / Uuid / "users")
            .and(warp::get())
            .and(with_state(state.clone()))
            .and_then(handlers::users::list::list))
        .or(warp::path!("api" / "users" / Uuid / "ban")
            .and(warp::put())
            .and(with_state(state.clone()))
            .and_then(handlers::users::update::ban_user))
        .or(warp::path!("api" / "users" / Uuid / "unban")
            .and(warp::put())
            .and(with_state(state.clone()))
            .and_then(handlers::users::update::unban_user))
        .or(warp::path!("api" / "users" / Uuid / "suspend")
            .and(warp::put())
            .and(warp::body::json())
            .and(with_state(state.clone()))
            .and_then(handlers::users::update::suspend_user))
        .or(warp::path!("api" / "users" / Uuid / "password")
            .and(warp::put())
            .and(warp::body::json())
            .and(with_state(state.clone()))
            .and_then(handlers::users::update::update_password))
        .or(warp::path!("api" / "users" / Uuid / "username")
            .and(warp::put())
            .and(warp::body::json())
            .and(with_state(state.clone()))
            .and_then(handlers::users::update::update_username))
        .or(warp::path!("api" / "users" / Uuid)
            .and(warp::delete())
            .and(with_state(state.clone()))
            .and_then(handlers::users::delete::delete))
        .or(warp::path!("api" / "realms" / Uuid / "login")
            .and(warp::post())
            .and(warp::body::json())
            .and(with_state(state.clone()))
            .and_then(handlers::users::actions::login))
        .or(warp::path!("api" / "realms" / Uuid / "groups")
            .and(warp::post())
            .and(warp::body::json())
            .and(with_state(state.clone()))
            .and_then(handlers::realms::actions::create_group))
        .or(warp::path!("api" / "realms" / Uuid / "groups")
            .and(warp::get())
            .and(with_state(state.clone()))
            .and_then(handlers::groups::list::list))
        .or(warp::path!("api" / "groups" / Uuid)
            .and(warp::patch())
            .and(warp::body::json())
            .and(with_state(state.clone()))
            .and_then(handlers::groups::update::update))
        .or(warp::path!("api" / "groups" / Uuid)
            .and(warp::delete())
            .and(with_state(state.clone()))
            .and_then(handlers::groups::delete::delete))
        .or(warp::path!("api" / "groups" / Uuid / "users")
            .and(warp::get())
            .and(with_state(state.clone()))
            .and_then(handlers::users::list::in_group))
        .or(warp::path!("api" / "users" / Uuid / "groups")
            .and(warp::get())
            .and(with_state(state.clone()))
            .and_then(handlers::groups::list::with_user))
        .or(warp::path!("api" / "users" / Uuid / "roles")
            .and(warp::get())
            .and(with_state(state.clone()))
            .and_then(handlers::roles::list::with_user))
        .or(warp::path!("api" / "groups" / Uuid / "users" / Uuid)
            .and(warp::post())
            .and(with_state(state.clone()))
            .and_then(handlers::groups::actions::add_user_to_group))
        .or(warp::path!("api" / "groups" / Uuid / "users" / Uuid)
            .and(warp::delete())
            .and(with_state(state.clone()))
            .and_then(handlers::groups::actions::remove_user_from_group))
        .or(warp::path!("api" / "realms" / Uuid / "roles")
            .and(warp::post())
            .and(warp::body::json())
            .and(with_state(state.clone()))
            .and_then(handlers::realms::actions::create_role))
        .or(warp::path!("api" / "realms" / Uuid / "roles")
            .and(warp::get())
            .and(with_state(state.clone()))
            .and_then(handlers::roles::list::list))
        .or(warp::path!("api" / "roles" / Uuid)
            .and(warp::patch())
            .and(warp::body::json())
            .and(with_state(state.clone()))
            .and_then(handlers::roles::update::update))
        .or(warp::path!("api" / "roles" / Uuid)
            .and(warp::delete())
            .and(with_state(state.clone()))
            .and_then(handlers::roles::delete::delete))
        .or(warp::path!("api" / "roles" / Uuid / "users")
            .and(warp::get())
            .and(with_state(state.clone()))
            .and_then(handlers::users::list::in_role))
        .or(warp::path!("api" / "roles" / Uuid / "users" / Uuid)
            .and(warp::post())
            .and(with_state(state.clone()))
            .and_then(handlers::roles::actions::add_user_to_role))
        .or(warp::path!("api" / "roles" / Uuid / "users" / Uuid)
            .and(warp::delete())
            .and(with_state(state.clone()))
            .and_then(handlers::roles::actions::remove_user_from_role))
        .or(warp::path!("api" / "groups" / Uuid / "roles" / Uuid)
            .and(warp::post())
            .and(with_state(state.clone()))
            .and_then(handlers::groups::actions::add_role_to_group))
        .or(warp::path!("api" / "groups" / Uuid / "roles" / Uuid)
            .and(warp::delete())
            .and(with_state(state.clone()))
            .and_then(handlers::groups::actions::remove_role_from_group))
        .or(warp::path!("api" / "groups" / Uuid / "roles")
            .and(warp::get())
            .and(with_state(state.clone()))
            .and_then(handlers::roles::list::in_group))
        .or(warp::path!("api" / "roles" / Uuid / "groups")
            .and(warp::get())
            .and(with_state(state.clone()))
            .and_then(handlers::groups::list::in_role))
        .or(warp::path!("api" / "realms" / Uuid / "permissions")
            .and(warp::post())
            .and(warp::body::json())
            .and(with_state(state.clone()))
            .and_then(handlers::realms::actions::create_permission))
        .or(warp::path!("api" / "realms" / Uuid / "permissions")
            .and(warp::get())
            .and(with_state(state.clone()))
            .and_then(handlers::permissions::list::list))
        .or(warp::path!("api" / "permissions" / Uuid)
            .and(warp::patch())
            .and(warp::body::json())
            .and(with_state(state.clone()))
            .and_then(handlers::permissions::update::update))
        .or(warp::path!("api" / "permissions" / Uuid)
            .and(warp::delete())
            .and(with_state(state.clone()))
            .and_then(handlers::permissions::delete::delete))
        .or(warp::path!("api" / "permissions" / Uuid / "users")
            .and(warp::get())
            .and(with_state(state.clone()))
            .and_then(handlers::users::list::with_permission))
        .or(warp::path!("api" / "permissions" / Uuid / "roles" / Uuid)
            .and(warp::post())
            .and(with_state(state.clone()))
            .and_then(handlers::permissions::actions::add_permission_to_role))
        .or(warp::path!("api" / "permissions" / Uuid / "roles" / Uuid)
            .and(warp::delete())
            .and(with_state(state.clone()))
            .and_then(handlers::permissions::actions::remove_permission_from_role))
        .or(warp::path!("api" / "permissions" / Uuid / "roles")
            .and(warp::get())
            .and(with_state(state.clone()))
            .and_then(handlers::roles::list::with_permission))
        .or(warp::path!("api" / "roles" / Uuid / "permissions")
            .and(warp::get())
            .and(with_state(state.clone()))
            .and_then(handlers::permissions::list::in_role))
        .or(warp::path!("api" / "permissions" / Uuid / "groups" / Uuid)
            .and(warp::post())
            .and(with_state(state.clone()))
            .and_then(handlers::permissions::actions::add_permission_to_group))
        .or(warp::path!("api" / "permissions" / Uuid / "groups" / Uuid)
            .and(warp::delete())
            .and(with_state(state.clone()))
            .and_then(handlers::permissions::actions::remove_permission_from_group))
        .or(warp::path!("api" / "permissions" / Uuid / "groups")
            .and(warp::get())
            .and(with_state(state.clone()))
            .and_then(handlers::groups::list::with_permission))
        .or(warp::path!("api" / "groups" / Uuid / "permissions")
            .and(warp::get())
            .and(with_state(state.clone()))
            .and_then(handlers::permissions::list::in_group))
        .or(warp::path!("api" / "permissions" / Uuid / "users" / Uuid)
            .and(warp::post())
            .and(with_state(state.clone()))
            .and_then(handlers::permissions::actions::add_permission_to_user))
        .or(warp::path!("api" / "permissions" / Uuid / "users" / Uuid)
            .and(warp::delete())
            .and(with_state(state.clone()))
            .and_then(handlers::permissions::actions::remove_permission_from_user))
        .or(warp::path!("api" / "permissions" / Uuid / "users")
            .and(warp::get())
            .and(with_state(state.clone()))
            .and_then(handlers::users::list::with_permission))
        .or(warp::path!("api" / "users" / Uuid / "permissions")
            .and(warp::get())
            .and(with_state(state.clone()))
            .and_then(handlers::permissions::list::with_user))

        .recover(crate::errors::handle_rejection)
}

fn with_state(
    state: AppState,
) -> impl Filter<Extract = (AppState,), Error = std::convert::Infallible> + Clone {
    warp::any().map(move || state.clone())
}
