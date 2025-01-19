use super::unit_of_magnitude::UnitOfMagnitudeError;

#[derive(Debug)]
pub enum SimulatorError {
    FloatingNode,
    UnconfiguredElement(String),
    ElementParserError(String),
    NoSchematicFound,
    FailedToCreateTempCircuitFile,
    FailedToWriteToTempCircuitFile,
    UnitError(UnitOfMagnitudeError),
    MalformedSimulationConfig,
}
