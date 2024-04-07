import React from "react";
import ReactDOM from "react-dom/client";

// main app component
import App from "./components/app/App.jsx";

// styles
import "./main.css";
import "./reset.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
