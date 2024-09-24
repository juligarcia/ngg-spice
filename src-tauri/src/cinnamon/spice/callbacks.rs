use crate::ngspice::types::*;
use crate::spice::manager::SpiceManager;
use libc::*;

pub unsafe extern "C" fn cbw_send_char<Manager: SpiceManager>(
    msg: *const c_char,
    id: c_int,
    user: *const c_void,
) -> c_int {
    unsafe {
        <Manager>::cb_send_char(
            &mut *(user as *mut Manager),
            std::ffi::CStr::from_ptr(msg).to_str().unwrap().to_owned(),
            id,
        );
    }
    0
}
pub unsafe extern "C" fn cbw_send_stat<Manager: SpiceManager>(
    msg: *const c_char,
    id: c_int,
    user: *const c_void,
) -> c_int {
    unsafe {
        <Manager>::cb_send_stat(
            &mut *(user as *mut Manager),
            std::ffi::CStr::from_ptr(msg).to_str().unwrap().to_owned(),
            id,
        );
    }
    0
}
pub unsafe extern "C" fn cbw_controlled_exit<Manager: SpiceManager>(
    status: c_int,
    immediate: bool,
    exit_on_quit: bool,
    id: c_int,
    user: *const c_void,
) -> c_int {
    unsafe {
        <Manager>::cb_ctrldexit(
            &mut *(user as *mut Manager),
            status,
            immediate,
            exit_on_quit,
            id,
        );
    }
    0
}
pub unsafe extern "C" fn cbw_send_data<Manager: SpiceManager>(
    pvecvaluesall: *const NgVecvaluesall,
    count: c_int,
    id: c_int,
    user: *const c_void,
) -> c_int {
    // todo: should be an option to bypass this code if the result is not used
    // create native PkVecvaluesall
    let pkvecinfoall = (*pvecvaluesall).to_pk();

    // call native callback
    <Manager>::cb_send_data(&mut *(user as *mut Manager), pkvecinfoall, count, id);
    0
}
pub unsafe extern "C" fn cbw_send_init_data<Manager: SpiceManager>(
    pvecinfoall: *const NgVecinfoall,
    id: c_int,
    user: *const c_void,
) -> c_int {
    // todo: should be an option to bypass this code if the result is not used
    // create native PkVecInfoall
    let pkvecinfoall = (*pvecinfoall).to_pk();

    // call native callback
    <Manager>::cb_send_init(&mut *(user as *mut Manager), pkvecinfoall, id);
    0
}
pub unsafe extern "C" fn cbw_bgthread_running<Manager: SpiceManager>(
    finished: bool,
    id: c_int,
    user: *const c_void,
) -> c_int {
    unsafe {
        <Manager>::cb_bgt_state(&mut *(user as *mut Manager), finished, id);
    }
    0
}
