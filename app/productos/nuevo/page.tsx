"use client";

import { useEffect, useState } from "react";

export default function NuevoProducto() {
  const [loading, setLoading] = useState(true);
  const [nombre, setNombre] = useState("");
  const [precio, setPrecio] = useState("");

  useEffect(() => {
    const user = localStorage.getItem("cotizapp_user");

    if (!user) {
      window.location.href = "/login";
    } else {
      setLoading(false);
    }
  }, []);

  const handleGuardar = (e: React.FormEvent) => {
    e.preventDefault();

    if (!nombre.trim() || !precio.trim()) {
      alert("Completa todos los campos");
      return;
    }

    const nuevoProducto = {
      id: Date.now(),
      nombre: nombre.trim(),
      precio: precio.trim(),
    };

    const productosGuardados = JSON.parse(
      localStorage.getItem("cotizapp_productos") || "[]"
    );

    productosGuardados.push(nuevoProducto);

    localStorage.setItem(
      "cotizapp_productos",
      JSON.stringify(productosGuardados)
    );

    window.location.href = "/productos";
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
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold">Nuevo producto</h1>

            <button
              onClick={() => (window.location.href = "/productos")}
              className="rounded-lg bg-white px-3 py-2 text-sm font-semibold text-blue-600"
            >
              Regresar
            </button>
          </div>

          <p className="mt-2 text-sm text-blue-100">
            Agrega un nuevo producto o servicio
          </p>
        </header>

        <form onSubmit={handleGuardar} className="flex-1 p-5 space-y-4">
          <div>
            <label className="text-sm font-medium text-slate-700">
              Nombre
            </label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Ej: Cámara Dahua"
              className="mt-1 w-full rounded-xl border border-slate-300 p-3 text-black outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="mt-1 text-xs text-blue-500">
              Nombre del producto o servicio
            </p>
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700">
              Precio
            </label>
            <input
              type="text"
              value={precio}
              onChange={(e) => setPrecio(e.target.value)}
              placeholder="Ej: 1500"
              className="mt-1 w-full rounded-xl border border-slate-300 p-3 text-black outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="mt-1 text-xs text-blue-500">
              Escribe el precio base del producto
            </p>
          </div>

          <button
            type="submit"
            className="w-full rounded-xl bg-blue-600 p-3 font-semibold text-white"
          >
            Guardar producto
          </button>
        </form>
      </div>
    </main>
  );
}