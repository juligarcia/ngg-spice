use super::paprika::ngspice::types::PkVecvaluesall;

// the payload type must implement `Serialize` and `Clone`.
#[derive(Clone, serde::Serialize)]
pub struct SimulationDataPayload {
    pub data: Vec<SimulationData>,
    pub id: String,
}

#[derive(Debug, serde::Serialize, Clone)]
pub struct ComputedData {
    pub name: String,
    pub c_real: f64,
    pub c_imag: f64,
    pub is_scale: bool,
    pub is_complex: bool,
}

#[derive(Debug, serde::Serialize, Clone)]
pub struct SimulationData {
    computed: i32,
    data_index: i32,
    computed_values_for_index: Vec<ComputedData>,
}

impl SimulationData {
    pub fn new(spice_vec: PkVecvaluesall) -> SimulationData {
        return SimulationData {
            computed: spice_vec.count,
            data_index: spice_vec.index,
            computed_values_for_index: spice_vec
                .vecsa
                .iter()
                .map(|it| ComputedData {
                    name: it.name.clone(),
                    c_real: it.creal,
                    c_imag: it.cimag,
                    is_scale: it.is_scale,
                    is_complex: it.is_complex,
                })
                .collect(),
        };
    }
}
