//! Native editor shell. The engine runs in the embedded browser; Rust handles
//! platform features such as files, export and window management.

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .run(tauri::generate_context!())
        .expect("falha ao iniciar o editor")
}
