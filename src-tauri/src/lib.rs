// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
use tauri::Builder;
mod functions;
pub use crate::functions::function::{download_update, install_update, sistema_operativo,share_pdf,save_pdf};

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    Builder::default()
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_dialog::init())
        .invoke_handler(tauri::generate_handler![download_update, install_update, sistema_operativo,share_pdf,save_pdf])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
