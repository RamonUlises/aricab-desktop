use reqwest;
use std::fs::File;
use std::io::{copy, Write};
use std::process::Command;

#[tauri::command]
pub fn sistema_operativo() -> &'static str {
    if cfg!(target_os = "windows") {
        return "windows";
    } else if cfg!(target_os = "linux") {
        return "linux";
    } else {
        return "otro";
    }
}

#[tauri::command]
pub async fn download_update(url: String) -> Result<String, String> {
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
pub fn install_update(path: String) -> Result<String, String> {
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

#[tauri::command]
pub fn share_pdf(pdf: Vec<u8>) -> Result<String, String> {
    let temp_dir = std::env::temp_dir();
    let pdf_path = temp_dir.join("reporte.pdf");

    let mut file = File::create(&pdf_path).map_err(|e| e.to_string())?;
    file.write_all(&pdf).map_err(|e| e.to_string())?;

    // Abrir el archivo con el comando adecuado según el sistema operativo
    if cfg!(target_os = "windows") {
        Command::new("explorer")
            .arg(pdf_path.to_string_lossy().to_string())
            .spawn()
            .map_err(|e| e.to_string())?;
    } else if cfg!(target_os = "linux") {
        Command::new("xdg-open")
            .arg(pdf_path.to_string_lossy().to_string())
            .spawn()
            .map_err(|e| e.to_string())?;
    } else if cfg!(target_os = "macos") {
        Command::new("open")
            .arg(pdf_path.to_string_lossy().to_string())
            .spawn()
            .map_err(|e| e.to_string())?;
    } else {
        return Err("Sistema operativo no soportado".to_string());
    }

    Ok(pdf_path.to_string_lossy().to_string())
}