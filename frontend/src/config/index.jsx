import axios from "axios";

export const BASE_URL = "https://nexora-54ck.onrender.com";
export const createServer = axios.create({
    baseURL:BASE_URL,

}); 