"use client";

import { useEffect, useState } from "react";

type Producto = {
  id: number;
  nombre: string;
  precio: string;
};

export default function EditarProducto() {
  const [loading, setLoading] = useState(true);
  const [productoId, setProductoId] = useState<number | null>(null);
  const [nombre, setNombre] = useState("");
  const [precio, setPrecio] = useState("");

  useEffect(() => {
    const user = localStorage.getItem("cotizapp_user");

    if (!user) {
      window.location.href = "/login";
      return;
    }

    const pathParts = window.location.pathname.split("/");
    const idString = pathParts[pathParts.length - 1];
    const id = Number(idString);

    if (!id || Number.isNaN(id)) {
      alert("ID inválido");
      window.location.href = "/productos";
      return;
    }

    setProductoId(id);

    const productos = JSON.parse(
      localStorage.getItem("cotizapp_productos") || "[]"
    ) as Producto[];

    const producto = productos.find((p) => p.id === id);

    if (!producto) {
      alert("Producto no encontrado");
      window.location.href = "/productos";
      return;
    }

    setNombre(producto.nombre);
    setPrecio(producto.precio);
    setLoading(false);
  }, []);

  const handleGuardar = (e: React.FormEvent) => {
    e.preventDefault();

    if (!nombre.trim() || !precio.trim() || productoId === null) {
      alert("Completa todos los campos");
      return;
    }

    const productos = JSON.parse(
      localStorage.getItem("cotizapp_productos") || "[]"
    ) as Producto[];

    const actualizados = productos.map((p) =>
      p.id === productoId
        ? {
            ...p,
            nombre: nombre.trim(),
            precio: precio.trim(),
          }
        : p
    );

    localStorage.setItem("cotizapp_productos", JSON.stringify(actualizados));

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
            <h1 className="text-xl font-bold">Editar producto</h1>

            <button
              onClick={() => (window.location.href = "/productos")}
              className="rounded-lg bg-white px-3 py-2 text-sm font-semibold text-blue-600"
            >
              Regresar
            </button>
          </div>

          <p className="mt-2 text-sm text-blue-100">
            Modifica los datos del producto
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
              className="mt-1 w-full rounded-xl border border-slate-300 p-3 text-black outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="mt-1 text-xs text-blue-500">
              Precio base del producto
            </p>
          </div>

          <button
            type="submit"
            className="w-full rounded-xl bg-blue-600 p-3 font-semibold text-white"
          >
            Guardar cambios
          </button>
        </form>
      </div>
    </main>
  );
}