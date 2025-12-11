import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const baseUrl = import.meta.env.VITE_API_BASE_URL_PROD || "";
    const [user, setUser] = useState(null);

    useEffect(() => {
        const savedUser = localStorage.getItem("user");
        if (savedUser) setUser(JSON.parse(savedUser));
    }, []);

    const login = async (email, password) => {
        try {
            const res = await fetch(`${baseUrl}/api/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
                credentials: "include"
            });

            const text = await res.text();
            const data = text ? JSON.parse(text) : {};

            if (!res.ok) {
                return { success: false, message: `Login failed: ${res.status}` };
            }

            if (data.success) {
                setUser(data.user);
                localStorage.setItem("user", JSON.stringify(data.user));
                return { success: true };
            }

            return { success: false, message: data.message || "Invalid credentials" };

        } catch {
            return { success: false, message: "Server connection error" };
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem("user");
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
