use super::ngspice::types::*;

pub trait SpiceManager {
    /// Callback known as SendChar in Ngspice User's Manual
    fn cb_send_char(&mut self, msg: String, id: i32);
    /// Callback known as SendStat in Ngspice User's Manual
    fn cb_send_stat(&mut self, msg: String, id: i32);
    /// Callback known as ControlledExit in Ngspice User's Manual
    fn cb_ctrldexit(&mut self, status: i32, is_immediate: bool, is_quit: bool, id: i32);
    /// Callback known as SendData in Ngspice User's Manual
    fn cb_send_data(&mut self, pkvecvaluesall: PkVecvaluesall, count: i32, id: i32);
    /// Callback known as SendInitData in Ngspice User's Manual
    fn cb_send_init(&mut self, pkvecinfoall: PkVecinfoall, id: i32);
    /// Callback known as BGThreadRunning in Ngspice User's Manual
    fn cb_bgt_state(&mut self, is_fin: bool, id: i32);
}
