import axios from "axios";

const API = axios.create({
  baseURL: "https://restaurant-management-system-mern-stack.onrender.com//api",
});

export default API;
