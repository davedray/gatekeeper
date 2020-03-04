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
    users (id) {
        id -> Uuid,
        realm_id -> Uuid,
        username -> Varchar,
        password_salt -> Nullable<Varchar>,
        password_hash -> Nullable<Varchar>,
        banned -> Bool,
        suspended_until -> Nullable<Timestamptz>,
        created_at -> Timestamptz,
        updated_at -> Timestamptz,
    }
}

joinable!(users -> realms (realm_id));

allow_tables_to_appear_in_same_query!(realms, users,);
