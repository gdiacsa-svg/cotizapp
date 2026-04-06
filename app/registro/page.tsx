"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../lib/supabase";

export default function RegistroPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState("");

  const handleRegister = async () => {
    setMensaje("");

    if (!email || !password) {
      setMensaje("Escribe correo y contraseña");
      return;
    }

    if (password.length < 6) {
      setMensaje("La contraseña debe tener mínimo 6 caracteres");
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      setMensaje(error.message);
      return;
    }

    router.push("/login");
    router.refresh();
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#eef2f6",
        padding: "24px 16px 32px",
        fontFamily: "Arial, sans-serif",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      {/* BLOQUE 1: LOGO */}
      <div
        style={{
          width: "100%",
          maxWidth: "420px",
          background: "#ffffff",
          borderRadius: "26px",
          padding: "28px 20px",
          boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginBottom: "18px",
        }}
      >
        <img
          src="/logo.png"
          alt="Logo CotizApp"
          style={{
            width: "150px",
            height: "auto",
            display: "block",
          }}
        />
      </div>

      {/* BLOQUE 2: FORMULARIO */}
      <div
        style={{
          width: "100%",
          maxWidth: "420px",
          background: "#ffffff",
          borderRadius: "26px",
          padding: "28px 22px 24px",
          boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
        }}
      >
        <h1
          style={{
            margin: 0,
            fontSize: "32px",
            lineHeight: 1.1,
            fontWeight: 800,
            color: "#0f172a",
            marginBottom: "14px",
          }}
        >
          Crear cuenta
        </h1>

        <p
          style={{
            margin: 0,
            fontSize: "15px",
            color: "#64748b",
            marginBottom: "28px",
          }}
        >
          Regístrate con tu correo y contraseña
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
            marginBottom: "24px",
          }}
        >
          Usa un correo válido para registrarte
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
          placeholder="Mínimo 6 caracteres"
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
            marginBottom: "18px",
          }}
        >
          Tu contraseña debe tener al menos 6 caracteres
        </p>

        {mensaje && (
          <div
            style={{
              background: "#eff6ff",
              color: "#1d4ed8",
              border: "1px solid #bfdbfe",
              borderRadius: "16px",
              padding: "12px 14px",
              fontSize: "14px",
              marginBottom: "18px",
            }}
          >
            {mensaje}
          </div>
        )}

        <button
          onClick={handleRegister}
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
            opacity: loading ? 0.8 : 1,
          }}
        >
          {loading ? "Creando cuenta..." : "Registrarme"}
        </button>

        <div
          style={{
            textAlign: "center",
            fontSize: "14px",
            color: "#64748b",
          }}
        >
          ¿Ya tienes cuenta?{" "}
          <a
            href="/login"
            style={{
              background: "transparent",
              color: "#2563eb",
              fontWeight: 700,
              textDecoration: "none",
            }}
          >
            Iniciar sesión
          </a>
        </div>
      </div>
    </main>
  );
}