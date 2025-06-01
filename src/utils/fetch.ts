import { server } from "../lib/server";

export function pet() {
  async function get(url: string) {
    try {
      const response = await fetch(url, {
        headers: {
          'Authorization': `Basic ${server.credetials}`
        }
      });

      return response.json();
    } catch {
      return null;
    }
  }

  async function post(url: string, body: unknown) {
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          'Authorization': `Basic ${server.credetials}`
        },
        body: JSON.stringify(body),
      });

      return response.json();
    } catch (error){
      console.log(error)
      return null;
    }
  }

  async function put(url: string, body: unknown) {
    try {
      const response = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          'Authorization': `Basic ${server.credetials}`
        },
        body: JSON.stringify(body),
      });

      return response.json();
    } catch {
      return null;
    }
  }

  async function deletee(url: string, body?: unknown) {
    try {
      const response = await fetch(url, {
        method: "DELETE",
        headers: {
          'Authorization': `Basic ${server.credetials}`
        },
        body: JSON.stringify(body),
      });

      return response.json();
    } catch {
      return null;
    }
  }

  return window.pet = {
    get,
    post,
    put,
    deletee,
  }
}