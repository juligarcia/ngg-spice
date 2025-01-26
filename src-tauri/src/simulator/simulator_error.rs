use serde::{Deserialize, Serialize};

use super::unit_of_magnitude::UnitOfMagnitudeError;

#[derive(Debug, Serialize, Deserialize)]
pub enum SimulatorError {
    FloatingNode(String),
    UnconfiguredElement(String),
    ElementParserError(String),
    NoSchematicFound,
    UnitError(UnitOfMagnitudeError),
    MalformedSimulationConfig(String),
    FailedToSaveGraphicSpiceFile,
}
