use std::path::Path;

use super::{
    compat::spice::{directives::Directives, lt_spice::model::bjt::bjt_model_to_domain},
    simulator::circuit::element::BjtModel,
};
use native_db::Database;

pub fn init_bjt_models<P: AsRef<Path>>(source: P, db: &Database<'_>) {
    log::info!("Initializing bjt models");

    let directives = Directives::new(source).expect("Failed to open seed file");

    let iter = directives.into_iter();

    let all_directives: Vec<String> = iter.collect();

    let mut bjt_models: Vec<BjtModel> = Vec::default();

    for directive in all_directives {
        if let Some(model) = bjt_model_to_domain(&directive) {
            bjt_models.push(model);
        }
    }

    log::info!("Successfully recovered all bjt models");

    let rw = db
        .rw_transaction()
        .expect("failed to create rw transaction");

    for model in bjt_models {
        rw.upsert(model).unwrap();
    }

    rw.commit().unwrap();

    log::info!("Successfully saved BJT model");
}
