use rusqlite::{Connection, Statement};
use serde::{Serialize, Deserialize};
use std::sync::Mutex;

pub struct DatabaseState(pub Mutex<DatabaseConnection>);

pub struct DatabaseConnection {
    pub conn: Connection,
}

impl DatabaseConnection {
    pub fn new() -> DatabaseConnection {
        DatabaseConnection {
            conn: Connection::open("data/records.db").expect("Failed to open database"),
        }
    }
}

#[derive(Serialize, Deserialize)]
pub struct DatabaseStruct {
    pub num_session: i16,
    pub duration: i16, // in minutes
    pub date: String,  // in yyyy-mm-dd, the standard way
}

pub fn create_database() -> Connection {
    let conn = Connection::open("data/records.db").expect("Failed to open database");

    conn.execute(
        "create table if not exists RECORDS (
             id integer primary key,
             num_session integer not null,
             duration integer not null,
             date int not null
         )",
        [],
    )
    .expect("Failed to create table");
    return conn;
}

pub fn append(num_session: i16, duration: i16, date: String, state: tauri::State<DatabaseState>) {
    let conn = &state.0.lock().unwrap().conn;
    conn.execute(
        "INSERT INTO RECORDS (num_session, duration, date) values (?1, ?2, date(?3))",
        [num_session.to_string(), duration.to_string(), date],
    )
    .expect("Failed to insert");
}

pub fn query_totals(
    date_start: String,
    date_end: String,
    state: tauri::State<DatabaseState>,
) -> Vec<DatabaseStruct> {
    let conn = &state.0.lock().unwrap().conn;
    let mut stmt = conn
        .prepare(
            "SELECT date, SUM(duration), SUM(num_session) FROM RECORDS 
                    WHERE date <= date(':date_end') AND date >= date(':date_start') 
                    GROUP BY date;",
        )
        .unwrap();
    transform_to_vec(stmt, date_start, date_end)
}
pub fn query_all(
    date_start: String,
    date_end: String,
    state: tauri::State<DatabaseState>,
) -> Vec<DatabaseStruct> {
    let conn = &state.0.lock().unwrap().conn;
    let mut stmt = conn
        .prepare(
            "SELECT date, duration, num_session FROM RECORDS 
                    WHERE date <= date(':date_end') AND date >= date(':date_start');",
        )
        .unwrap();
    transform_to_vec(stmt, date_start, date_end)
}

fn transform_to_vec(stmt: Statement, date_start: String, date_end: String) -> Vec<DatabaseStruct> {
    let data = stmt
        .query_map(
            &[
                (":date_end", date_end.as_str()),
                (":date_start", date_start.as_str()),
            ],
            |row| {
                Ok(DatabaseStruct {
                    num_session: row.get(2)?,
                    duration: row.get(1)?,
                    date: row.get(0)?,
                })
            },
        )
        .expect("Something went wrong in querying for result!");
    let mut res: Vec<DatabaseStruct> = vec![];
    for dat in data {
        res.push(dat.unwrap());
    }
    res
}