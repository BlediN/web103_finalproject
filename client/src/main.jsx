import React from "react";
import ReactDOM from "react-dom/client";
import axios from "axios";
import App from "./App.jsx";
import "./index.css";
// import "./styles/global.css";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";
axios.defaults.baseURL = API_BASE_URL;
axios.defaults.withCredentials = true;

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
