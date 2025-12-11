import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import AppRoutes from "./routes/AppRoutes.jsx";
import ScrollToTop from "./components/ScrollToTop.jsx";

function App() {
    const [message, setMessage] = useState("");
    const [selectedEvent, setSelectedEvent] = useState("");
    const location = useLocation();

    useEffect(() => {
        fetch(`${import.meta.env.VITE_API_BASE_URL_PROD}/api/hello`)
            .then((res) => res.text())
            .then((data) => setMessage(data))
            .catch((err) => console.error(err));
    }, []);

    // ✅ Fixed condition: removed the stray semicolon, added all routes properly
    const hideLayout =
        location.pathname.startsWith("/admin") ||
        location.pathname === "/user-login" ||
        location.pathname === "/user-create-account" ||
        location.pathname === "/user-forgot-password"||
        location.pathname === "/unauthorized";

    return (
        <>
            {!hideLayout && <Header onWorkShopChange={setSelectedEvent} />}

            <main style={{ minHeight: "80vh", padding: "2rem" }}>
                <ScrollToTop />
                {!hideLayout && (
                    <>
                        <p>
                            <strong>Message from Backend:</strong> {message}
                        </p>
                        {selectedEvent && (
                            <p>
                                You selected: <strong>{selectedEvent}</strong>
                            </p>
                        )}
                    </>
                )}
                <AppRoutes />
            </main>

            {!hideLayout && <Footer />}
        </>
    );
}

export default App;
