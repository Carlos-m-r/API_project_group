import { baseURL } from "./conf.js";
import { apiKey } from "./conf.js";

export async function callAPI(path, options = {}) {
    const url = `${baseURL}${apiKey}${path}`;

    try {
        const res = await fetch(url, {
            headers: {"Content-Type" : "application/json"},
            ...options
        });

        if(!res.ok) throw new Error(`Error${res.status}`);

        return await res.json();
    } catch (error) {
        console.error("API Error: ", error);
        throw error;
    }
}
