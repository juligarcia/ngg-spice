use std::{
    fs::File,
    io::{self, BufRead, BufReader},
    path::Path,
};

#[derive(Debug)]
pub enum DirectivesError {
    FailedToOpenSource,
}

impl From<io::Error> for DirectivesError {
    fn from(_: io::Error) -> Self {
        DirectivesError::FailedToOpenSource
    }
}

#[derive(Debug)]
pub struct Directives {
    buffer: Option<String>,
    reader: BufReader<File>,
    is_appending: bool,
}

impl Directives {
    pub fn new<P: AsRef<Path>>(from: P) -> Result<Directives, DirectivesError> {
        let file = File::open(from)?;
        let reader = BufReader::new(file);

        Ok(Directives {
            reader,
            buffer: None,
            is_appending: false,
        })
    }

    fn _next(&mut self) -> String {
        let mut line = String::new();

        if let Some(buffer) = &self.buffer {
            line = buffer.trim().to_owned();
            self.buffer = None;
        } else {
            if let Ok(0) = self.reader.read_line(&mut line) {
                return "".to_owned();
            }
        }

        if self.is_appending {
            // If I'm appending a directive
            // I only care about a continuation,
            // Lines that start with +

            if line.starts_with("+") {
                let clean_line = line.replace("+", "");
                let trimmed_line = clean_line.trim();
                let line_without_eoc = trimmed_line.split(";").next().unwrap();

                return format!(" {}", line_without_eoc) + &self._next();
            }

            self.buffer = Some(line);
            self.is_appending = false;
            return "".to_owned();
        } else {
            // If I'm not appending a directive
            // I only care about a new directive's start: ".",
            // Or comment & blank lines
            // Anything else should be considered motive to stop

            if line.starts_with(".") {
                self.is_appending = true;
                let trimmed_line = line.trim();
                let line_without_eoc = trimmed_line.split(";").next().unwrap();
                return line_without_eoc.to_owned() + &self._next();
            }

            if line.starts_with("*") || line.trim().is_empty() {
                return self._next();
            }

            return "".to_owned();
        }
    }
}

impl Iterator for Directives {
    // We can refer to this type using Self::Item
    type Item = String;

    // The return type is `Option<T>`:
    //     * When the `Iterator` is finished, `None` is returned.
    //     * Otherwise, the next value is wrapped in `Some` and returned.
    // We use Self::Item in the return type, so we can change
    // the type without having to update the function signatures.
    fn next(&mut self) -> Option<Self::Item> {
        let directive = self._next();

        if directive.is_empty() {
            return None;
        }

        return Some(directive);
    }
}
