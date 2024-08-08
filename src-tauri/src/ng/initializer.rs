use crate::{PkSpiceManager, PkVecinfoall, PkVecvaluesall};
use colored::Colorize;
use std::{
    collections::VecDeque,
    sync::{Arc, RwLock},
};

pub struct Manager {
    sharedres: Arc<RwLock<VecDeque<String>>>,
    quit_flag: bool,
    vec_char: Vec<String>,
    vec_stat: Vec<String>,
    vec_pkvecinfoall: Vec<PkVecinfoall>,
    vec_pkvecvalsall: Vec<PkVecvaluesall>,
}

impl Manager {
    pub fn new(arvs: Arc<RwLock<VecDeque<String>>>) -> Manager {
        Manager {
            sharedres: arvs,
            quit_flag: false,
            vec_char: Vec::<String>::new(),
            vec_stat: Vec::<String>::new(),
            vec_pkvecinfoall: Vec::<PkVecinfoall>::new(),
            vec_pkvecvalsall: Vec::<PkVecvaluesall>::new(),
        }
    }
}

impl PkSpiceManager for Manager {
    fn cb_send_char(&mut self, msg: String, id: i32) {
        let mut arvs = self.sharedres.write().unwrap();
        (*arvs).push_back(msg.clone());

        let opt = msg.split_once(' ');
        let (token, msgs) = match opt {
            Some(tup) => (tup.0, tup.1),
            None => (msg.as_str(), msg.as_str()),
        };
        let msgc = match token {
            "stdout" => msgs.green(),
            "stderr" => msgs.red(),
            _ => msg.magenta().strikethrough(),
        };
        println!("{}", msgc);
    }

    fn cb_send_stat(&mut self, msg: String, id: i32) {
        println!("{}", msg.blue());
    }

    fn cb_ctrldexit(&mut self, status: i32, is_immediate: bool, is_quit: bool, id: i32) {
        println!(
            "ctrldexit {}; {}; {}; {};",
            status, is_immediate, is_quit, id
        );
        self.quit_flag = true;
    }

    fn cb_send_init(&mut self, pkvecinfoall: PkVecinfoall, id: i32) {
        self.vec_pkvecinfoall.push(pkvecinfoall);
    }

    fn cb_send_data(&mut self, pkvecvaluesall: PkVecvaluesall, count: i32, id: i32) {
        self.vec_pkvecvalsall.push(pkvecvaluesall);
    }

    fn cb_bgt_state(&mut self, is_fin: bool, id: i32) {
        println!("bgt_state {}; {};", is_fin, id);
    }
}
