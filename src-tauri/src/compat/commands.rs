use super::{
    circuit::canvas::BjtModel as CanvasBjtModel, spice::lt_spice::model::bjt::bjt_model_to_domain,
};

#[tauri::command]
pub fn parse_bjt_model_directive(maybe_model_directive: &str) -> Option<CanvasBjtModel> {
    bjt_model_to_domain(maybe_model_directive).and_then(|model| Some(model.to_canvas()))
}
