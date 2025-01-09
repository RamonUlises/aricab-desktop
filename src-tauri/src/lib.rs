// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
use reqwest;
use std::fs::File;
use std::io::copy;
use std::process::Command;

#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[tauri::command]
fn sistema_operativo() -> &'static str {
    if cfg!(target_os = "windows") {
        return "windows";
    } else if cfg!(target_os = "linux") {
        return "linux";
    } else {
        return "otro";
    }
}

#[tauri::command]
async fn download_update(url: String) -> Result<String, String> {
    let path_segments: Vec<&str> = url.split('/').collect();
    let filename = path_segments.last().unwrap_or(&"update_file").to_string();
    let extension = filename.split('.').last().unwrap_or("unknown");

    let username = "aricab-1123-r-company";
    let password = "b24bc6442284142ce8d6e187961d37b0c7e7";

    let destination = std::env::temp_dir().join(format!("update_file.{}", extension));

    // Crear un cliente con Basic Auth
    let client = reqwest::Client::new();
    match client
        .get(&url)
        .basic_auth(username, Some(password)) // Configurar Basic Auth
        .send()
        .await
    {
        Ok(response) => {
            if !response.status().is_success() {
                return Err(format!("Error en la descarga: Código de estado {}", response.status()));
            }

            let mut dest_file = match File::create(&destination) {
                Ok(file) => file,
                Err(err) => return Err(format!("No se pudo crear el archivo: {}", err)),
            };

            let content = match response.bytes().await {
                Ok(bytes) => bytes,
                Err(err) => return Err(format!("Error al obtener los datos: {}", err)),
            };

            if let Err(err) = copy(&mut content.as_ref(), &mut dest_file) {
                return Err(format!("Error al guardar el archivo: {}", err));
            }

            // Si la descarga fue exitosa, devolvemos la ruta del archivo descargado
            Ok(destination.to_string_lossy().to_string())
        }
        Err(err) => Err(format!("Error al hacer la solicitud: {}", err)),
    }
}

#[tauri::command]
fn install_update(path: String) -> Result<String, String> {
    // Detectar el sistema operativo
    if cfg!(target_os = "windows") {
        // En Windows, ejecutamos el archivo .exe
        let output = Command::new("cmd")
            .args(&["/C", "start", &path])  // Ejecuta el archivo .exe
            .output();  // Usamos output() para capturar la salida y el código de error

        match output {
            Ok(output) => {
                if output.status.success() {
                    return Ok("La actualización en Windows se completó exitosamente.".to_string());
                } else {
                    let error_message = String::from_utf8_lossy(&output.stderr);
                    return Err(format!("Error al ejecutar el instalador en Windows: {}", error_message));
                }
            }
            Err(err) => {
                return Err(format!("Error al ejecutar el comando en Windows: {}", err));
            }
        }
    } else if cfg!(target_os = "linux") {
        // En Linux, usamos dpkg para instalar archivos .deb
        let output = Command::new("sudo")
            .args(&["dpkg", "-i", &path])  // Instala el archivo .deb
            .output();  // Usamos output() para capturar la salida y el código de error

        match output {
            Ok(output) => {
                if output.status.success() {
                    return Ok("La actualización en Linux se completó exitosamente.".to_string());
                } else {
                    let error_message = String::from_utf8_lossy(&output.stderr);
                    return Err(format!("Error al ejecutar el instalador en Linux: {}", error_message));
                }
            }
            Err(err) => {
                return Err(format!("Error al ejecutar el comando en Linux: {}", err));
            }
        }
    } else {
        return Err("Sistema operativo no soportado".to_string());
    }
}

use tauri::Builder;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![greet, download_update, install_update, sistema_operativo])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
