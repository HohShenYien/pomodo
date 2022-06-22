#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use std::{fs, sync::Mutex};

mod database;
mod settings;

// As all inputs outputs are handled by the application, rather than taking
// from users, expect and unwrap are fine
#[tauri::command]
fn store_settings(data: String) {
    settings::store(data);
}

#[tauri::command]
fn get_settings() -> String {
    settings::get()
}

#[tauri::command]
fn append_data(data: String, state: tauri::State<database::DatabaseState>) {
    let value: database::DatabaseStruct = serde_json::from_str(data.as_str()).unwrap();
    database::append(value.num_session, value.duration, value.date, state)
}

#[tauri::command]
fn query_totals(
    start_date: String,
    end_date: String,
    state: tauri::State<database::DatabaseState>,
) -> String {
    let value = database::query_totals(start_date, end_date, state);
    serde_json::to_string(&value).unwrap()
}

#[tauri::command]
fn query_data(
    start_date: String,
    end_date: String,
    state: tauri::State<database::DatabaseState>,
) -> String {
    let value = database::query_all(start_date, end_date, state);
    serde_json::to_string(&value).unwrap()
}

fn main() {
    init();
    tauri::Builder::default()
        // This is where you pass in your commands
        .manage(database::DatabaseState(Mutex::new(
            database::DatabaseConnection::new(),
        )))
        .invoke_handler(tauri::generate_handler![
            store_settings,
            get_settings,
            append_data,
            query_totals,
            query_data,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

fn init() {
    fs::create_dir_all("data").expect("Something went wrong");
    database::create_database();
}
