CREATE TABLE groups (
   id UUID PRIMARY KEY,
   realm_id UUID NOT NULL REFERENCES realms(id),
   name VARCHAR(255) NOT NULL,
   description TEXT NOT NULL,
   created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
   updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
   CONSTRAINT unique_realm_group UNIQUE (realm_id, name)
);