import axios from "axios";

// Replace with your machine's IP when testing on a real Android device.
// Example: http://192.168.1.10:5000/api
const api = axios.create({
  baseURL: "http://10.0.2.2:5000/api", // Android Emulator
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;