use super::ngspice::commands::*;

#[cfg(unix)]
use libloading::os::unix::Symbol as RawSymbol;
#[cfg(windows)]
use libloading::os::windows::Symbol as RawSymbol;
use libloading::{Error as LibLoadingError, Library};

#[derive(Clone)]
pub struct SpiceEngine {
    pub init: RawSymbol<NgSpiceInit>,
    pub init_sync: RawSymbol<NgSpiceInitSync>,
    pub command: RawSymbol<NgSpiceCommand>,
    pub get_vec_info: RawSymbol<NgSpiceVecInfo>,
    // b"ngCM_Input_Path\0";
    // b"ngGet_Evt_NodeInfo\0";
    // b"ngSpice_AllEvtNodes\0";
    // b"ngSpice_Init_Evt\0";
    // b"ngSpice_Circ\0";
    pub get_cur_plot: RawSymbol<NgSpiceCurPlot>,
    pub get_all_plots: RawSymbol<NgSpiceAllPlots>,
    pub get_all_vecs: RawSymbol<NgSpiceAllVecs>,
    pub is_running: RawSymbol<NgSpiceRunning>,
    // b"ngSpice_SetBkpt\0";
}

impl SpiceEngine {
    unsafe fn get_symbol<T>(
        lib: &Library,
        symbol_name: &[u8],
    ) -> Result<RawSymbol<T>, SpiceEngineError> {
        let symbol = lib.get(symbol_name).map_err(|error| {
            SpiceEngineError::SymbolNotFound(
                String::from_utf8_unchecked(symbol_name.to_owned()),
                error,
            )
        })?;

        Ok(libloading::Symbol::<T>::into_raw(symbol))
    }

    // Get symbols in  the same order as they appear in sharedspice.h
    pub unsafe fn new(lib: &Library) -> Result<SpiceEngine, SpiceEngineError> {
        let init = SpiceEngine::get_symbol::<NgSpiceInit>(lib, b"ngSpice_Init\0")?;
        let init_sync = SpiceEngine::get_symbol::<NgSpiceInitSync>(lib, b"ngSpice_Init_Sync\0")?;
        let command = SpiceEngine::get_symbol::<NgSpiceCommand>(lib, b"ngSpice_Command\0")?;
        let get_vec_info = SpiceEngine::get_symbol::<NgSpiceVecInfo>(lib, b"ngGet_Vec_Info\0")?;
        let get_cur_plot = SpiceEngine::get_symbol::<NgSpiceCurPlot>(lib, b"ngSpice_CurPlot\0")?;
        let get_all_plots = SpiceEngine::get_symbol::<NgSpiceAllPlots>(lib, b"ngSpice_AllPlots\0")?;
        let get_all_vecs = SpiceEngine::get_symbol::<NgSpiceAllVecs>(lib, b"ngSpice_AllVecs\0")?;
        let is_running = SpiceEngine::get_symbol::<NgSpiceRunning>(lib, b"ngSpice_running\0")?;

        Ok(SpiceEngine {
            init,
            init_sync,
            command,
            get_vec_info,
            get_cur_plot,
            get_all_plots,
            get_all_vecs,
            is_running,
        })
    }
}

#[derive(Debug)]
pub enum SpiceEngineError {
    SymbolNotFound(String, LibLoadingError),
}
