use anyhow::Error as OpaqueError;
use crate::{GetRealmError, SaveRealmError};

#[derive(thiserror::Error, Debug)]
#[error("Something went wrong.")]
pub struct DatabaseError {
    #[from]
    source: OpaqueError,
}

impl From<GetRealmError> for DatabaseError {
    fn from(e: GetRealmError) -> Self {
        match e {
            GetRealmError::NotFound { source, .. } => source,
            GetRealmError::DatabaseError(e) => e,
        }
    }
}

impl From<SaveRealmError> for DatabaseError {
    fn from(e: SaveRealmError) -> Self {
        match e {
            SaveRealmError::UniqueName { source, .. } => source,
            SaveRealmError::DatabaseError(e) => e,
        }
    }
}