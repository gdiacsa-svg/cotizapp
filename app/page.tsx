"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = localStorage.getItem("cotizapp_user");

    if (!user) {
      window.location.href = "/login";
    } else {
      setLoading(false);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("cotizapp_user");
    window.location.href = "/login";
  };

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-100">
        <p className="text-base font-medium text-slate-600">Cargando...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-100">
      <div className="mx-auto flex min-h-screen w-full max-w-md flex-col bg-white shadow-xl">
        <header className="bg-blue-600 px-5 pb-6 pt-10 text-white">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-medium opacity-90">CotizApp</p>
              <h1 className="mt-2 text-3xl font-bold leading-tight">
                Cotiza rápido
                <br />
                desde tu celular
              </h1>
            </div>

            <button
              onClick={handleLogout}
              className="rounded-lg bg-white px-3 py-2 text-sm font-semibold text-blue-600 shadow"
            >
              Salir
            </button>
          </div>

          <p className="mt-3 text-sm text-blue-100">
            Crea clientes, agrega productos y genera cotizaciones profesionales.
          </p>
        </header>

        <section className="grid grid-cols-2 gap-4 p-5">
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

        <section className="px-5 pb-6">
          <div className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
            <p className="text-sm font-semibold text-slate-900">
              Actividad rápida
            </p>

            <div className="mt-3 space-y-3">
              <div className="flex items-center justify-between rounded-xl bg-white px-4 py-3 ring-1 ring-slate-200">
                <span className="text-sm text-slate-600">
                  Cotizaciones hoy
                </span>
                <span className="text-lg font-bold text-slate-900">
                  0
                </span>
              </div>

              <div className="flex items-center justify-between rounded-xl bg-white px-4 py-3 ring-1 ring-slate-200">
                <span className="text-sm text-slate-600">
                  Clientes registrados
                </span>
                <span className="text-lg font-bold text-slate-900">
                  0
                </span>
              </div>

              <div className="flex items-center justify-between rounded-xl bg-white px-4 py-3 ring-1 ring-slate-200">
                <span className="text-sm text-slate-600">
                  Productos activos
                </span>
                <span className="text-lg font-bold text-slate-900">
                  0
                </span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}