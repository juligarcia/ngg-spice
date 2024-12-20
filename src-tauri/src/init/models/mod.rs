pub mod bjt;
use std::path::Path;

use bjt::init_bjt_models;
use native_db::Database;

use super::*;

pub fn init_models<P: AsRef<Path>>(source: P, db: &Database<'_>) {
    init_bjt_models(source, db);
}
