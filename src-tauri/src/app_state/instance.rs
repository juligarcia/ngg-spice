use std::{path::PathBuf, time::Instant};

#[derive(Clone)]
pub enum InstanceState {
    NotSaved,
    FailedToSave { last_modified: Instant, path: PathBuf },
    Saved { last_modified: Instant, path: PathBuf },
}
