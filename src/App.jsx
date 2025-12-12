import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import AppRoutes from "./routes/AppRoutes.jsx";
import ScrollToTop from "./components/ScrollToTop.jsx";
import axios from "axios";

axios.defaults.withCredentials = true;

function App() {
    const location = useLocation();

    const hideChrome =
        location.pathname.startsWith("/admin") ||
        location.pathname === "/user-login" ||
        location.pathname === "/user-create-account" ||
        location.pathname === "/user-forgot-password" ||
        location.pathname === "/unauthorized";

    return (
        <>
            {!hideChrome && <Header />}

            <main style={{ minHeight: "80vh", padding: hideChrome ? "0" : "2rem" }}>
                <ScrollToTop />
                <AppRoutes />
            </main>

            {!hideChrome && <Footer />}
        </>
    );
}

export default App;
