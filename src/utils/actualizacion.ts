import { server } from "../lib/server";
import { ActuType } from "../types/actu";
import { invoke } from "@tauri-apps/api/core";
import { openUrl } from '@tauri-apps/plugin-opener';
import { confirm } from '@tauri-apps/plugin-dialog';

export async function actualizacion() {
  try {
    const response = await fetch(`${server.url}/aplicacion/actualizar`, {
      headers: {
        Authorization: `Basic ${server.credetials}`,
      },
    });

    const data: ActuType = await response.json();
    const currentVersion = "3.4.0";

    if (data.version !== currentVersion) {
      const userResponse = await confirm(
        `Nueva versión disponible: ${data.version}. ¿Quieres actualizar?`
      );

      if (userResponse) {
        const platformDesk = await invoke<string>('sistema_operativo');

        if(platformDesk === "otro") return;

        if(platformDesk === "windows") {
          const url = data.platforms.window.url;
          openUrl(url);
          return;
        }
        
        const downloadUrl = platformDesk === "windows" ? data.platforms.window.url : data.platforms.linux.url;
        
        const downPath = await invoke<string>('download_update', { url: downloadUrl });

        if(downPath.toLowerCase().includes("error")) return;

        const confirmation = await confirm("La aplicación se descargó correctamente. ¿Deseas reiniciar para completar la instalación?");

        if(confirmation){
          await invoke('install_update', { path: downPath });
        }
      }
    } else {
      return false;
    }
  } catch(error) {
    console.log(error)
    return null;
  }
}
