table! {
    groups (id) {
        id -> Uuid,
        realm_id -> Uuid,
        name -> Varchar,
        description -> Text,
        created_at -> Timestamptz,
        updated_at -> Timestamptz,
    }
}

table! {
    groups_roles (group_id, role_id) {
        group_id -> Uuid,
        role_id -> Uuid,
        created_at -> Timestamptz,
        updated_at -> Timestamptz,
    }
}

table! {
    realms (id) {
        id -> Uuid,
        name -> Varchar,
        description -> Text,
        enabled -> Bool,
        created_at -> Timestamptz,
        updated_at -> Timestamptz,
    }
}

table! {
    roles (id) {
        id -> Uuid,
        realm_id -> Uuid,
        name -> Varchar,
        description -> Text,
        created_at -> Timestamptz,
        updated_at -> Timestamptz,
    }
}

table! {
    users (id) {
        id -> Uuid,
        realm_id -> Uuid,
        username -> Varchar,
        password_salt -> Varchar,
        password_hash -> Varchar,
        banned -> Bool,
        suspended_until -> Nullable<Timestamptz>,
        created_at -> Timestamptz,
        updated_at -> Timestamptz,
    }
}

table! {
    users_groups (user_id, group_id) {
        user_id -> Uuid,
        group_id -> Uuid,
        created_at -> Timestamptz,
        updated_at -> Timestamptz,
    }
}

table! {
    users_roles (user_id, role_id) {
        user_id -> Uuid,
        role_id -> Uuid,
        created_at -> Timestamptz,
        updated_at -> Timestamptz,
    }
}

joinable!(groups -> realms (realm_id));
joinable!(groups_roles -> groups (group_id));
joinable!(groups_roles -> roles (role_id));
joinable!(roles -> realms (realm_id));
joinable!(users -> realms (realm_id));
joinable!(users_groups -> groups (group_id));
joinable!(users_groups -> users (user_id));
joinable!(users_roles -> roles (role_id));
joinable!(users_roles -> users (user_id));

allow_tables_to_appear_in_same_query!(
    groups,
    groups_roles,
    realms,
    roles,
    users,
    users_groups,
    users_roles,
);
