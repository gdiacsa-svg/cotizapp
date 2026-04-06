"use client";

import { useEffect, useState } from "react";
import { supabase } from "./lib/supabase";

type AuthUser = {
  id: string;
  email?: string;
};

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.user) {
        window.location.href = "/login";
        return;
      }

      setUser({
        id: session.user.id,
        email: session.user.email,
      });

      setLoading(false);
    };

    checkSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session?.user) {
        window.location.href = "/login";
      } else {
        setUser({
          id: session.user.id,
          email: session.user.email,
        });
        setLoading(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-100">
        <p className="text-base font-medium text-slate-600">Cargando...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-100">
      {/* 🔹 BLOQUE LOGO (MISMO QUE LOGIN) */}
      <div className="mx-auto w-full max-w-md px-4 pt-6">
        <div
          style={{
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
            style={{
              width: "150px",
              height: "auto",
            }}
          />
        </div>
      </div>

      {/* 🔹 CONTENIDO */}
      <div className="mx-auto w-full max-w-md px-4 pt-4">
        <section className="grid grid-cols-2 gap-4">
          <button className="rounded-2xl bg-blue-500 p-5 text-left text-white shadow-md">
            <div className="text-2xl">+</div>
            <div className="mt-3 text-base font-semibold">
              Nueva cotización
            </div>
            <div className="mt-1 text-sm text-blue-100">
              Empieza rápido
            </div>
          </button>

          <button className="rounded-2xl bg-slate-900 p-5 text-left text-white shadow-md">
            <div className="text-2xl">📄</div>
            <div className="mt-3 text-base font-semibold">
              Cotizaciones
            </div>
            <div className="mt-1 text-sm text-slate-300">
              Ver historial
            </div>
          </button>

          <button
            onClick={() => (window.location.href = "/clientes")}
            className="rounded-2xl bg-white p-5 text-left text-slate-900 shadow-md ring-1 ring-slate-200"
          >
            <div className="text-2xl">👤</div>
            <div className="mt-3 text-base font-semibold">
              Clientes
            </div>
            <div className="mt-1 text-sm text-slate-500">
              Administra contactos
            </div>
          </button>

          <button
            onClick={() => (window.location.href = "/productos")}
            className="rounded-2xl bg-white p-5 text-left text-slate-900 shadow-md ring-1 ring-slate-200"
          >
            <div className="text-2xl">🧰</div>
            <div className="mt-3 text-base font-semibold">
              Productos
            </div>
            <div className="mt-1 text-sm text-slate-500">
              Tu catálogo base
            </div>
          </button>
        </section>

        {/* 🔹 INFO USUARIO */}
        <section className="mt-4">
          <div className="rounded-2xl bg-white p-4 shadow">
            <p className="text-sm text-slate-500">Sesión:</p>
            <p className="text-sm font-semibold text-slate-900">
              {user?.email}
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}