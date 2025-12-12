import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function OAuthSuccess() {
    const navigate = useNavigate();

    useEffect(() => {
        localStorage.setItem(
            "user",
            JSON.stringify({ role: "ADMIN" })
        );

        setTimeout(() => {
            navigate("/admin/dashboard");
        }, 300);

    }, []);

    return <h2>Signing you in...</h2>;
}
