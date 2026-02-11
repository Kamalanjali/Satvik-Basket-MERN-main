import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function OAuthSuccess() {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (!token) {
      navigate("/login", { replace: true });
      return;
    }

    // 🔐 Save token
    localStorage.setItem("token", token);

    // 🔄 Force auth-aware components to re-evaluate
    window.dispatchEvent(new Event("auth-changed"));

    // 🚀 Go home
    navigate("/", { replace: true });
  }, [navigate]);

  return <p>Signing you in…</p>;
}
