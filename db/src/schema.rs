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
