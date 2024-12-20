use std::fs::File;

use super::circuit::schematic::Schematic;

pub trait Engine {
    fn file_to_domain(&self, file: File) -> Schematic;
}
