use std::fs::{File, read_to_string};
use std::io::Write;

pub fn store(settings: String) {
    let mut f = File::create("data/settings.json").expect("Unable to create file");
    f.write_all(settings.as_bytes()).expect("Unable to write data");
}

pub fn get() -> String {
    return match read_to_string("data/settings.json") {
        Ok(res) => res,
        Err(_) => "".to_string(),
    };
}