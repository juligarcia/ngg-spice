pub mod instance;
pub mod models;

use std::sync::Mutex;

use super::*;
use instance::InstanceState;
use native_db::Database;

pub struct AppState {
    pub bjt_models: Database<'static>,
    pub instance_state: Mutex<InstanceState>,
}
