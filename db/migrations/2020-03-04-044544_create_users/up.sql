CREATE TABLE users (
    id UUID PRIMARY KEY,
    realm_id UUID NOT NULL REFERENCES realms(id),
    username VARCHAR(255) NOT NULL,
    password_salt VARCHAR(32),
    password_hash VARCHAR(128),
    banned BOOLEAN NOT NULL DEFAULT 'f',
    suspended_until TIMESTAMPTZ DEFAULT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_realm_username UNIQUE (realm_id, username)
);