use crate::DatabaseError;
use uuid::Uuid;

#[derive(thiserror::Error, Debug)]
pub enum GetRealmError {
    #[error("There is no realm with id {id:?}.")]
    NotFound {
        id: Uuid,
        source: DatabaseError,
    },
    #[error("Something went wrong.")]
    DatabaseError(#[from] DatabaseError),
}


#[derive(thiserror::Error, Debug)]
pub enum SaveRealmError {
    #[error("There is already a realm with name {name:?}.")]
    UniqueName {
        name: String,
        source: DatabaseError,
    },
    #[error("Something went wrong.")]
    DatabaseError(#[from] DatabaseError),
}