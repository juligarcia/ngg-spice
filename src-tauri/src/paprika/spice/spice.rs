use super::{
    callbacks,
    engine::{SpiceEngine, SpiceEngineError},
    manager::SpiceManager,
    ngspice::types::*,
    utils::string::c_strings_to_vec_string,
};
use libc::*;
use libloading::Library;
use std::{
    ffi::{OsStr, OsString},
    sync::Arc,
};

#[derive(Clone)]
pub struct Spice<Manager: SpiceManager> {
    // Shares de spice engine
    engine: SpiceEngine,

    // Shares the manager refernce across threads safely
    manager: Option<Arc<Manager>>,
    id: Arc<i32>,
}

impl<Manager: SpiceManager> Spice<Manager> {
    pub fn init(
        path: &OsStr,
        manager: Manager,
        id: i32,
    ) -> Result<(Spice<Manager>, Library), SpiceError> {
        unsafe {
            let lib = match Library::new(path) {
                Ok(lib) => lib,
                Err(e) => {
                    log::error!("{:?}", e);
                    return Err(SpiceError::SharedspiceNotFound(path.to_os_string()));
                }
            };

            let thread_safe_manager = Arc::new(manager);
            let thread_safe_id = Arc::new(id);

            let engine = SpiceEngine::new(&lib)
                .map_err(|error| SpiceError::EngineFailedToInitialize(error))?;

            (engine.init)(
                Some(callbacks::cbw_send_char::<Manager>),
                Some(callbacks::cbw_send_stat::<Manager>),
                Some(callbacks::cbw_controlled_exit::<Manager>),
                Some(callbacks::cbw_send_data::<Manager>),
                Some(callbacks::cbw_send_init_data::<Manager>),
                Some(callbacks::cbw_bgthread_running::<Manager>),
                &*thread_safe_manager as *const _ as *const c_void,
            );

            (engine.init_sync)(
                None,
                None,
                None,
                &*thread_safe_id as *const _ as *const c_int,
                &*thread_safe_manager as *const _ as *const c_void,
            );

            Ok((
                Spice {
                    engine,
                    manager: Some(thread_safe_manager),
                    id: thread_safe_id,
                },
                lib,
            ))
        }
    }

    pub fn command(&self, cmdstr: &str) -> bool {
        let ret: i32 = {
            let ccmdstr = std::ffi::CString::new(cmdstr).unwrap();
            // Returns 1 if error is present, 0 if not
            (self.engine.command)(ccmdstr.as_ptr())
        };

        ret != 0
    }

    pub fn clear_control_structures(&self) -> bool {
        let result = (self.engine.command)(std::ptr::null());
        result != 0
    }

    pub fn get_vec_info(&self, vecname: &str) -> PkVectorinfo {
        unsafe {
            let cvecname = std::ffi::CString::new(vecname).unwrap();
            let pvectorinfo = (self.engine.get_vec_info)(cvecname.as_ptr());
            (*pvectorinfo).to_pk()
        }
    }

    pub fn get_cur_plot(&self) -> String {
        unsafe {
            let pcstr = (self.engine.get_cur_plot)();
            std::ffi::CStr::from_ptr(pcstr)
                .to_str()
                .unwrap()
                .to_string()
        }
    }

    pub fn get_all_plots(&self) -> Vec<String> {
        unsafe {
            let ppcstr = (self.engine.get_all_plots)();
            c_strings_to_vec_string(ppcstr)
        }
    }

    pub fn get_all_vecs(&self) -> Vec<String> {
        unsafe {
            let ppcstr = (self.engine.get_all_plots)();
            c_strings_to_vec_string(ppcstr)
        }
    }

    pub fn is_running(&self) -> bool {
        (self.engine.is_running)()
    }
}

#[derive(Debug)]
pub enum SpiceError {
    SharedspiceNotFound(OsString),
    EngineFailedToInitialize(SpiceEngineError),
}
