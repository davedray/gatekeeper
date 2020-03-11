use crate::models::{Realm, UpdateRealm, Group};
use crate::Postgres;
use diesel::prelude::*;
use diesel::result::Error;
use uuid::Uuid;

pub fn find(repo: &Postgres) -> Result<Vec<Realm>, Error> {
    use crate::schema::realms::dsl::*;
    realms.load(&repo.conn())
}

pub fn find_one(repo: &Postgres, uuid: Uuid) -> Result<Realm, Error> {
    use crate::schema::realms::dsl::*;
    realms.filter(id.eq(uuid)).first(&repo.conn())
}

pub fn create(repo: &Postgres, realm: domain::NewRealm) -> Result<Realm, Error> {
    use crate::schema::realms;
    let r = Realm::from_new(realm);
    diesel::insert_into(realms::table)
        .values(&r)
        .get_result(&repo.conn())
}

pub fn update(repo: &Postgres, realm: domain::UpdateRealm) -> Result<Realm, Error> {
    use crate::schema::realms::dsl::*;
    let r = UpdateRealm::from(realm);
    diesel::update(realms.find(r.id))
        .set(&r)
        .get_result(&repo.conn())
}

pub fn delete(repo: &Postgres, realm: Uuid) -> Option<Error> {
    use crate::schema::realms::dsl::*;
    diesel::delete(realms.find(realm))
        .execute(&repo.conn())
        .err()
}

pub fn find_group(repo: &Postgres, realm: Uuid, uuid: Uuid) -> Result<Group, Error> {
    use crate::schema::groups::dsl::*;
    groups.filter(id.eq(uuid).and(realm_id.eq(realm))).first(&repo.conn())
}
