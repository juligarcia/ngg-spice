use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
pub enum UnitOfMagnitudeError {
    FailedToParseBase,
    IncorrectValuePassed,
    InvalidUnitOfMagnitude,
    IncorrectMagnitudePassed,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub enum UnitOfMagnitude {
    Tera(f64),
    Giga(f64),
    Mega(f64),
    Kilo(f64),
    Mil(f64),
    Mili(f64),
    Micro(f64),
    Nano(f64),
    Pico(f64),
    Femto(f64),
    Base(f64),
}

impl UnitOfMagnitude {
    pub fn format(&self) -> String {
        match &self {
            UnitOfMagnitude::Tera(base) => format!("{}T", base.to_string()),
            UnitOfMagnitude::Giga(base) => format!("{}G", base.to_string()),
            UnitOfMagnitude::Mega(base) => format!("{}Meg", base.to_string()),
            UnitOfMagnitude::Kilo(base) => format!("{}K", base.to_string()),
            UnitOfMagnitude::Mil(base) => format!("{}mil", base.to_string()),
            UnitOfMagnitude::Mili(base) => format!("{}m", base.to_string()),
            UnitOfMagnitude::Micro(base) => format!("{}u", base.to_string()),
            UnitOfMagnitude::Nano(base) => format!("{}n", base.to_string()),
            UnitOfMagnitude::Pico(base) => format!("{}p", base.to_string()),
            UnitOfMagnitude::Femto(base) => format!("{}f", base.to_string()),
            UnitOfMagnitude::Base(base) => {
                format!("{}", UnitOfMagnitude::format_with_exponential(base))
            }
        }
    }

    fn format_with_exponential(base: &f64) -> String {
        if *base >= 10e3 || *base <= 1e-3 {
            format!("{:e}", base)
        } else {
            base.to_string()
        }
    }

    fn parse_base_unit(input: String) -> Result<f64, UnitOfMagnitudeError> {
        let unit_base: f64 = input
            .parse()
            .map_err(|_| UnitOfMagnitudeError::FailedToParseBase)?;

        return Ok(unit_base);
    }

    fn parse_unit(input: String, uom: &str) -> Result<f64, UnitOfMagnitudeError> {
        let lowercase_input = input.to_lowercase();
        let uom_split: Vec<&str> = lowercase_input.split(&uom.to_lowercase()).collect();

        if uom_split.len() < 2 {
            return Err(UnitOfMagnitudeError::IncorrectMagnitudePassed);
        }

        if let [maybe_base, trailing] = uom_split[0..2] {
            if !trailing.is_empty() {
                return Err(UnitOfMagnitudeError::IncorrectMagnitudePassed);
            }

            let unit_base: f64 = maybe_base
                .parse()
                .map_err(|_| UnitOfMagnitudeError::FailedToParseBase)?;

            return Ok(unit_base);
        }

        Err(UnitOfMagnitudeError::IncorrectValuePassed)
    }

    pub fn from(formatted: String) -> Result<UnitOfMagnitude, UnitOfMagnitudeError> {
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
