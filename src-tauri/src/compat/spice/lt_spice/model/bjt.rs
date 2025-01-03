use std::collections::HashMap;

use crate::compat::{
    circuit::element::{BjtModel, BjtPolarity},
    unit_of_magnitude::UnitOfMagnitude as Unit,
};

pub fn bjt_model_to_domain(model: &str) -> Option<BjtModel> {
    let parts: Vec<&str> = model.split('(').collect();

    if let Some([directive_name_polarity, model_parameters]) = parts.get(0..2) {
        if let Some([directive, name, polarity]) = directive_name_polarity
            .split_whitespace()
            .collect::<Vec<&str>>()
            .get(0..3)
        {
            let is_npn = polarity.to_lowercase() == "npn";
            let is_pnp = polarity.to_lowercase() == "pnp";

            if directive.to_lowercase() == ".model" && !name.is_empty() && (is_npn || is_pnp) {
                let clean_parameters = model_parameters.replace(")", "");
                let model_parameters = clean_parameters.split_whitespace();

                let mut parsed_parameters = HashMap::new();

                for parameter in model_parameters {
                    if let Some((key, value)) = parameter.split_once('=') {
                        parsed_parameters.insert(key.to_lowercase(), value);
                    }
                }

                return Some(BjtModel {
                    name: name.to_string(),

                    polarity: if is_npn {
                        BjtPolarity::Npn
                    } else {
                        BjtPolarity::Pnp
                    },

                    is: parsed_parameters
                        .get("is")
                        .and_then(|is| Unit::from(is.to_string()).map_or(None, |is| Some(is))),
                    xti: parsed_parameters
                        .get("xti")
                        .and_then(|xti| Unit::from(xti.to_string()).map_or(None, |xti| Some(xti))),
                    eg: parsed_parameters
                        .get("eg")
                        .and_then(|eg| Unit::from(eg.to_string()).map_or(None, |eg| Some(eg))),
                    vaf: parsed_parameters
                        .get("vaf")
                        .and_then(|vaf| Unit::from(vaf.to_string()).map_or(None, |vaf| Some(vaf))),
                    bf: parsed_parameters
                        .get("bf")
                        .and_then(|bf| Unit::from(bf.to_string()).map_or(None, |bf| Some(bf))),
                    ise: parsed_parameters
                        .get("ise")
                        .and_then(|ise| Unit::from(ise.to_string()).map_or(None, |ise| Some(ise))),
                    ne: parsed_parameters
                        .get("ne")
                        .and_then(|ne| Unit::from(ne.to_string()).map_or(None, |ne| Some(ne))),
                    ikf: parsed_parameters
                        .get("ikf")
                        .and_then(|ikf| Unit::from(ikf.to_string()).map_or(None, |ikf| Some(ikf))),
                    nk: parsed_parameters
                        .get("nk")
                        .and_then(|nk| Unit::from(nk.to_string()).map_or(None, |nk| Some(nk))),
                    xtb: parsed_parameters
                        .get("xtb")
                        .and_then(|xtb| Unit::from(xtb.to_string()).map_or(None, |xtb| Some(xtb))),
                    br: parsed_parameters
                        .get("br")
                        .and_then(|br| Unit::from(br.to_string()).map_or(None, |br| Some(br))),
                    isc: parsed_parameters
                        .get("isc")
                        .and_then(|isc| Unit::from(isc.to_string()).map_or(None, |isc| Some(isc))),
                    nc: parsed_parameters
                        .get("nc")
                        .and_then(|nc| Unit::from(nc.to_string()).map_or(None, |nc| Some(nc))),
                    ikr: parsed_parameters
                        .get("ikr")
                        .and_then(|ikr| Unit::from(ikr.to_string()).map_or(None, |ikr| Some(ikr))),
                    rc: parsed_parameters
                        .get("rc")
                        .and_then(|rc| Unit::from(rc.to_string()).map_or(None, |rc| Some(rc))),
                    cjc: parsed_parameters
                        .get("cjc")
                        .and_then(|cjc| Unit::from(cjc.to_string()).map_or(None, |cjc| Some(cjc))),
                    mjc: parsed_parameters
                        .get("mjc")
                        .and_then(|mjc| Unit::from(mjc.to_string()).map_or(None, |mjc| Some(mjc))),
                    vjc: parsed_parameters
                        .get("vjc")
                        .and_then(|vjc| Unit::from(vjc.to_string()).map_or(None, |vjc| Some(vjc))),
                    fc: parsed_parameters
                        .get("fc")
                        .and_then(|fc| Unit::from(fc.to_string()).map_or(None, |fc| Some(fc))),
                    cje: parsed_parameters
                        .get("cje")
                        .and_then(|cje| Unit::from(cje.to_string()).map_or(None, |cje| Some(cje))),
                    mje: parsed_parameters
                        .get("mje")
                        .and_then(|mje| Unit::from(mje.to_string()).map_or(None, |mje| Some(mje))),
                    vje: parsed_parameters
                        .get("vje")
                        .and_then(|vje| Unit::from(vje.to_string()).map_or(None, |vje| Some(vje))),
                    tr: parsed_parameters
                        .get("tr")
                        .and_then(|tr| Unit::from(tr.to_string()).map_or(None, |tr| Some(tr))),
                    tf: parsed_parameters
                        .get("tf")
                        .and_then(|tf| Unit::from(tf.to_string()).map_or(None, |tf| Some(tf))),
                    itf: parsed_parameters
                        .get("itf")
                        .and_then(|itf| Unit::from(itf.to_string()).map_or(None, |itf| Some(itf))),
                    xtf: parsed_parameters
                        .get("xtf")
                        .and_then(|xtf| Unit::from(xtf.to_string()).map_or(None, |xtf| Some(xtf))),
                    vtf: parsed_parameters
                        .get("vtf")
                        .and_then(|vtf| Unit::from(vtf.to_string()).map_or(None, |vtf| Some(vtf))),
                    rb: parsed_parameters
                        .get("rb")
                        .and_then(|rb| Unit::from(rb.to_string()).map_or(None, |rb| Some(rb))),
                });
            }
        }
    }

    return None;
}
