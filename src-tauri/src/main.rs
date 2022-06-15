#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]

use std::fs;

mod settings;
mod database;

#[tauri::command]
fn store_settings(data: String) {
  settings::store(data);
}


#[tauri::command]
fn get_settings() -> String {
  settings::get()
}

fn main() {
  init();
  tauri::Builder::default()
      // This is where you pass in your commands
    .invoke_handler(tauri::generate_handler![store_settings, get_settings])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}

fn init() {
  fs::create_dir_all("data").expect("Something went wrong");
}