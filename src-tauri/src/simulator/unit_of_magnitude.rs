use serde::{Deserialize, Serialize};

pub trait Unit {
    fn format(&self) -> String;

    fn new(base: i16) -> Self;
}

#[derive(Debug)]
pub enum UnitOfMagnitudeError {
    FailedToParseBase,
    IncorrectValuePassed,
    InvalidUnitOfMagnitude,
    IncorrectMagnitudePassed,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub enum UnitOfMagnitude<U: Unit> {
    Tera(U),
    Giga(U),
    Mega(U),
    Kilo(U),
    Mil(U),
    Mili(U),
    Micro(U),
    Nano(U),
    Pico(U),
    Femto(U),
    Base(U),
}

impl<U: Unit> UnitOfMagnitude<U> {
    pub fn format(&self) -> String {
        match &self {
            UnitOfMagnitude::Tera(unit) => format!("{}T", unit.format()),
            UnitOfMagnitude::Giga(unit) => format!("{}G", unit.format()),
            UnitOfMagnitude::Mega(unit) => format!("{}Meg", unit.format()),
            UnitOfMagnitude::Kilo(unit) => format!("{}K", unit.format()),
            UnitOfMagnitude::Mil(unit) => format!("{}mil", unit.format()),
            UnitOfMagnitude::Mili(unit) => format!("{}m", unit.format()),
            UnitOfMagnitude::Micro(unit) => format!("{}u", unit.format()),
            UnitOfMagnitude::Nano(unit) => format!("{}n", unit.format()),
            UnitOfMagnitude::Pico(unit) => format!("{}p", unit.format()),
            UnitOfMagnitude::Femto(unit) => format!("{}f", unit.format()),
            UnitOfMagnitude::Base(unit) => format!("{}", unit.format()),
        }
    }

    fn parse_base_unit(input: String) -> Result<U, UnitOfMagnitudeError> {
        let unit_base: i16 = input
            .parse()
            .map_err(|_| UnitOfMagnitudeError::FailedToParseBase)?;

        return Ok(U::new(unit_base));
    }

    fn parse_unit(input: String, uom: &str) -> Result<U, UnitOfMagnitudeError> {
        let lowercase_input = input.to_lowercase();
        let uom_split: Vec<&str> = lowercase_input.split(&uom.to_lowercase()).collect();

        if uom_split.len() < 2 {
            return Err(UnitOfMagnitudeError::IncorrectMagnitudePassed);
        }

        if let [maybe_base, trailing] = uom_split[0..2] {
            if !trailing.is_empty() {
                return Err(UnitOfMagnitudeError::IncorrectMagnitudePassed);
            }

            let unit_base: i16 = maybe_base
                .parse()
                .map_err(|_| UnitOfMagnitudeError::FailedToParseBase)?;

            return Ok(U::new(unit_base));
        }

        Err(UnitOfMagnitudeError::IncorrectValuePassed)
    }

    pub fn from(formatted: String) -> Result<UnitOfMagnitude<U>, UnitOfMagnitudeError> {
        if let Ok(unit) = UnitOfMagnitude::parse_unit(formatted.clone(), "T") {
            return Ok(UnitOfMagnitude::Tera(unit));
        }

        if let Ok(unit) = UnitOfMagnitude::parse_unit(formatted.clone(), "G") {
            return Ok(UnitOfMagnitude::Giga(unit));
        }

        if let Ok(unit) = UnitOfMagnitude::parse_unit(formatted.clone(), "Meg") {
            return Ok(UnitOfMagnitude::Mega(unit));
        }

        if let Ok(unit) = UnitOfMagnitude::parse_unit(formatted.clone(), "K") {
            return Ok(UnitOfMagnitude::Kilo(unit));
        }

        if let Ok(unit) = UnitOfMagnitude::parse_unit(formatted.clone(), "mil") {
            return Ok(UnitOfMagnitude::Mil(unit));
        }

        if let Ok(unit) = UnitOfMagnitude::parse_unit(formatted.clone(), "m") {
            return Ok(UnitOfMagnitude::Mili(unit));
        }

        if let Ok(unit) = UnitOfMagnitude::parse_unit(formatted.clone(), "u") {
            return Ok(UnitOfMagnitude::Micro(unit));
        }

        if let Ok(unit) = UnitOfMagnitude::parse_unit(formatted.clone(), "n") {
            return Ok(UnitOfMagnitude::Nano(unit));
        }

        if let Ok(unit) = UnitOfMagnitude::parse_unit(formatted.clone(), "p") {
            return Ok(UnitOfMagnitude::Pico(unit));
        }

        if let Ok(unit) = UnitOfMagnitude::parse_unit(formatted.clone(), "f") {
            return Ok(UnitOfMagnitude::Femto(unit));
        }

        if let Ok(unit) = UnitOfMagnitude::parse_base_unit(formatted.clone()) {
            return Ok(UnitOfMagnitude::Base(unit));
        };
        return Err(UnitOfMagnitudeError::InvalidUnitOfMagnitude);
    }
}
