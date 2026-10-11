//! Casca nativa do editor. A engine roda no navegador embutido; o Rust só
//! cuida do que o navegador não faz (arquivos, exportação, janela).

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .run(tauri::generate_context!())
        .expect("falha ao iniciar o editor")
}
