"use client";

import { useEffect, useMemo, useState } from "react";

type Producto = {
  id: number;
  nombre: string;
  precio: string;
};

export default function Productos() {
  const [loading, setLoading] = useState(true);
  const [productos, setProductos] = useState<Producto[]>([]);
  const [busqueda, setBusqueda] = useState("");

  useEffect(() => {
    const user = localStorage.getItem("cotizapp_user");

    if (!user) {
      window.location.href = "/login";
      return;
    }

    const data = JSON.parse(
      localStorage.getItem("cotizapp_productos") || "[]"
    ) as Producto[];

    setProductos(data);
    setLoading(false);
  }, []);

  const productosFiltrados = useMemo(() => {
    const texto = busqueda.trim().toLowerCase();

    if (!texto) return productos;

    return productos.filter((producto) => {
      const nombre = producto.nombre.toLowerCase();
      const precio = producto.precio.toLowerCase();

      return nombre.includes(texto) || precio.includes(texto);
    });
  }, [productos, busqueda]);

  const handleEliminar = (id: number) => {
    const confirmar = window.confirm(
      "¿Seguro que quieres borrar este producto?"
    );

    if (!confirmar) return;

    const actualizados = productos.filter((producto) => producto.id !== id);

    localStorage.setItem("cotizapp_productos", JSON.stringify(actualizados));
    setProductos(actualizados);
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
            <h1 className="text-xl font-bold">Productos</h1>

            <button
              onClick={() => (window.location.href = "/")}
              className="rounded-lg bg-white px-3 py-2 text-sm font-semibold text-blue-600"
            >
              Regresar
            </button>
          </div>

          <p className="mt-2 text-sm text-blue-100">
            Administra tu catálogo de productos
          </p>
        </header>

        <section className="p-5 pb-3">
          <button
            onClick={() => (window.location.href = "/productos/nuevo")}
            className="w-full rounded-xl bg-blue-600 p-3 font-semibold text-white"
          >
            + Nuevo producto
          </button>
        </section>

        <section className="px-5 pb-3">
          <div>
            <label className="text-sm font-medium text-slate-700">
              Buscar producto
            </label>
            <input
              type="text"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Escribe nombre o precio"
              className="mt-1 w-full rounded-xl border border-slate-300 p-3 text-black outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="mt-1 text-xs text-blue-500">
              La lista se filtra automáticamente mientras escribes
            </p>
          </div>
        </section>

        <section className="flex-1 space-y-3 px-5 pb-5">
          {productos.length === 0 && (
            <div className="rounded-xl bg-slate-50 p-4 ring-1 ring-slate-200">
              <p className="text-sm text-slate-500">No hay productos aún</p>
            </div>
          )}

          {productos.length > 0 && productosFiltrados.length === 0 && (
            <div className="rounded-xl bg-slate-50 p-4 ring-1 ring-slate-200">
              <p className="text-sm text-slate-500">
                No se encontraron productos con esa búsqueda
              </p>
            </div>
          )}

          {productosFiltrados.map((producto) => (
            <div
              key={producto.id}
              className="rounded-xl bg-white p-4 shadow ring-1 ring-slate-200"
            >
              <p className="font-semibold text-slate-900">{producto.nombre}</p>
              <p className="text-sm text-slate-500">${producto.precio}</p>

              <div className="mt-4 grid grid-cols-2 gap-2">
                <button
                  onClick={() =>
                    (window.location.href = `/productos/editar/${producto.id}`)
                  }
                  className="w-full rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white"
                >
                  Editar
                </button>

                <button
                  onClick={() => handleEliminar(producto.id)}
                  className="w-full rounded-lg bg-red-600 px-3 py-2 text-sm font-semibold text-white"
                >
                  Borrar
                </button>
              </div>
            </div>
          ))}
        </section>
      </div>
    </main>
  );
}