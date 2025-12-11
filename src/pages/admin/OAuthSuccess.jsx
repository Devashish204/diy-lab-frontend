import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function OAuthSuccess() {
    const navigate = useNavigate();

    useEffect(() => {
        localStorage.setItem(
            "user",
            JSON.stringify({ role: "ADMIN" })
        );

        navigate("/admin");
    }, []);

    return <h2>Signing you in...</h2>;
}
