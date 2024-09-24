use super::unit_of_magnitude::UnitOfMagnitudeError;

#[derive(Debug)]
pub enum SimulatorError {
    FloatingNode,
    ElementParserError(String),
    NoSchematicFound,
    FailedToCreateTempCircuitFile,
    FailedToWriteToTempCircuitFile,
    UnitError(UnitOfMagnitudeError),
    MalformedSimulationConfig,
}
