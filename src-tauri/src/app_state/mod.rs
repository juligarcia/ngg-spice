pub mod models;

use super::*;
use native_db::Database;

pub struct AppState<'d> {
    pub bjt_models: Database<'d>,
}
