"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../lib/supabase";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState("");

  const handleLogin = async () => {
    setMensaje("");

    if (!email || !password) {
      setMensaje("Escribe correo y contraseña");
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      setMensaje(error.message);
      return;
    }

    router.push("/");
    router.refresh();
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#eef2f6",
        padding: "20px 16px 32px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div
        style={{
          maxWidth: "420px",
          margin: "0 auto 18px",
          background: "#ffffff",
          padding: "28px 20px",
          borderRadius: "24px",
          boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
          textAlign: "center",
        }}
      >
        <img
          src="/logo.png"
          alt="Logo"
          style={{
            width: "140px",
            display: "block",
            margin: "0 auto",
          }}
        />
      </div>

      <div
        style={{
          maxWidth: "420px",
          margin: "0 auto",
          background: "#ffffff",
          padding: "28px 22px 24px",
          borderRadius: "24px",
          boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
        }}
      >
        <h1
          style={{
            margin: 0,
            fontSize: "32px",
            fontWeight: 800,
            color: "#0f172a",
            marginBottom: "10px",
          }}
        >
          Iniciar sesión
        </h1>

        <p
          style={{
            margin: 0,
            fontSize: "15px",
            color: "#64748b",
            marginBottom: "26px",
          }}
        >
          Entra a tu cuenta para continuar
        </p>

        <label
          style={{
            display: "block",
            fontSize: "14px",
            fontWeight: 600,
            color: "#1e293b",
            marginBottom: "8px",
          }}
        >
          Correo
        </label>

        <input
          type="email"
          placeholder="Ej: tucorreo@correo.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{
            width: "100%",
            boxSizing: "border-box",
            padding: "16px 18px",
            borderRadius: "18px",
            border: "1px solid #cbd5e1",
            outline: "none",
            fontSize: "16px",
            color: "#0f172a",
            background: "#ffffff",
            marginBottom: "10px",
          }}
        />

        <p
          style={{
            margin: 0,
            fontSize: "12px",
            color: "#94a3b8",
            marginBottom: "22px",
          }}
        >
          Usa el correo con el que te registraste
        </p>

        <label
          style={{
            display: "block",
            fontSize: "14px",
            fontWeight: 600,
            color: "#1e293b",
            marginBottom: "8px",
          }}
        >
          Contraseña
        </label>

        <input
          type="password"
          placeholder="Ingresa tu contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{
            width: "100%",
            boxSizing: "border-box",
            padding: "16px 18px",
            borderRadius: "18px",
            border: "1px solid #cbd5e1",
            outline: "none",
            fontSize: "16px",
            color: "#0f172a",
            background: "#ffffff",
            marginBottom: "10px",
          }}
        />

        <p
          style={{
            margin: 0,
            fontSize: "12px",
            color: "#94a3b8",
            marginBottom: "22px",
          }}
        >
          Escribe tu contraseña para acceder
        </p>

        {mensaje ? (
          <div
            style={{
              background: "#eff6ff",
              color: "#1d4ed8",
              border: "1px solid #bfdbfe",
              padding: "12px 14px",
              borderRadius: "14px",
              fontSize: "14px",
              marginBottom: "18px",
            }}
          >
            {mensaje}
          </div>
        ) : null}

        <button
          onClick={handleLogin}
          disabled={loading}
          style={{
            width: "100%",
            border: "none",
            borderRadius: "18px",
            background: "#2563eb",
            color: "#ffffff",
            padding: "18px 16px",
            fontSize: "18px",
            fontWeight: 700,
            cursor: "pointer",
            marginBottom: "22px",
            opacity: loading ? 0.7 : 1,
          }}
        >
          {loading ? "Entrando..." : "Entrar"}
        </button>

        <div
          style={{
            textAlign: "center",
            fontSize: "14px",
            color: "#64748b",
          }}
        >
          ¿No tienes cuenta?{" "}
          <a
            href="/registro"
            style={{
              color: "#2563eb",
              fontWeight: 700,
              textDecoration: "none",
            }}
          >
            Crear cuenta
          </a>
        </div>
      </div>
    </main>
  );
}