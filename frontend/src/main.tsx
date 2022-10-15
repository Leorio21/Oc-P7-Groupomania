import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import AuthContextProvider from "./Context/AuthContext";

import App from "./App";
import "./index.scss";

ReactDOM.createRoot(document.getElementById("app-root") as HTMLElement).render(
    <AuthContextProvider>
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </AuthContextProvider>
);
