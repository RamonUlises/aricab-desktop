import { server } from "@/lib/server";

export async function abonarCredito(id: string, abonoCredito: number) {
  try {
    const response = await window.pet.put(
      `${server.url}/creditos/abonar/${id}`,
      {
        abono: abonoCredito,
      }
    ) as { message: string };

    if (response.message === "Credito abonado") return true;
    

    return false;
  } catch {
    return false;
  }
}