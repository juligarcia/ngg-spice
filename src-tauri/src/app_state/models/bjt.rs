use super::{simulator::circuit::element::BjtModel as InnerBjtModel, AppState};
use crate::simulator::circuit::canvas::BjtModel as CanvasBjtModel;
use bjt_models::BjtModel;
use itertools::Itertools;
use native_db::{db_type::Error, Database, Models};
use once_cell::sync::Lazy;

pub mod bjt_models {
    use super::InnerBjtModel;

    pub type BjtModel = InnerBjtModel;
}

pub static DATABASE_BJT_MODELS: Lazy<Models> = Lazy::new(|| {
    let mut models = Models::new();
    models.define::<bjt_models::BjtModel>().unwrap();
    models
});

pub enum BjtDbError {
    FailedInsert,
    FailedToCommit,
    Unhandeled,
}

impl serde::Serialize for BjtDbError {
    fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
    where
        S: serde::ser::Serializer,
    {
        serializer.serialize_str(match self {
            BjtDbError::FailedInsert => "Failed to insert model into db",
            BjtDbError::FailedToCommit => "Failed while saving model",
            BjtDbError::Unhandeled => "Something went wrong",
        })
    }
}

#[tauri::command]
pub fn load_bjt_models(app_state: tauri::State<AppState>) -> Vec<CanvasBjtModel> {
    log::info!("Loading all bjt models from memory");

    let r = app_state
        .bjt_models
        .r_transaction()
        .expect("failed to create r transaction");

    let models: Vec<InnerBjtModel> = r
        .scan()
        .primary()
        .expect("fail to scan primary")
        .all()
        .expect("failed to scan all")
        .try_collect()
        .expect("failed to collect");

    let canvas_models: Vec<CanvasBjtModel> = models.into_iter().map(|m| m.to_canvas()).collect();

    canvas_models
}

#[tauri::command]
pub fn save_bjt_model(
    model: CanvasBjtModel,
    app_state: tauri::State<AppState>,
) -> Result<(), BjtDbError> {
    log::info!("Saving BJT model");

    let model = model.to_domain();

    let rw = app_state
        .bjt_models
        .rw_transaction()
        .expect("failed to create rw transaction");

    rw.upsert(model).map_err(|err| match err {
        Error::DuplicateKey { key_name: _ } => BjtDbError::FailedInsert,
        _ => BjtDbError::Unhandeled,
    })?;

    rw.commit().map_err(|_| BjtDbError::FailedToCommit)?;

    log::info!("Successfully saved BJT model");

    return Ok(());
}

pub fn get_bjt_model(model: &str, db: &Database<'static>) -> Result<Option<BjtModel>, Error> {
    let r = db.r_transaction()?;
    let model: Option<BjtModel> = r.get().primary(model)?;

    Ok(model)
}
