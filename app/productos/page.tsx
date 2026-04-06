"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../lib/supabase";

type Producto = {
  id: number;
  nombre: string;
  precio: number;
};

export default function ProductosPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [productos, setProductos] = useState<Producto[]>([]);
  const [busqueda, setBusqueda] = useState("");

  const normalizarTexto = (texto: string) =>
    (texto || "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .trim();

  const cargarProductos = async () => {
    const { data, error } = await supabase
      .from("productos")
      .select("id, nombre, precio")
      .order("nombre", { ascending: true });

    if (error) {
      console.log(error);
      return;
    }

    setProductos(data || []);
    setLoading(false);
  };

  useEffect(() => {
    const init = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.user) {
        router.push("/login");
        return;
      }

      await cargarProductos();
    };

    init();
  }, [router]);

  const productosFiltrados = useMemo(() => {
    const texto = normalizarTexto(busqueda);

    if (!texto) return productos;

    return productos.filter((p) => {
      return (
        normalizarTexto(p.nombre).includes(texto) ||
        String(p.precio).includes(texto)
      );
    });
  }, [productos, busqueda]);

  const handleEliminar = async (id: number) => {
    if (!confirm("¿Borrar producto?")) return;

    await supabase.from("productos").delete().eq("id", id);

    setProductos((prev) => prev.filter((p) => p.id !== id));
  };

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        Cargando...
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-100">
      <div className="mx-auto w-full max-w-md px-4 pt-6 pb-6">

        {/* HEADER */}
        <div className="bg-white rounded-2xl p-5 mb-4 shadow">
          <h1 className="text-2xl font-bold text-black">Productos</h1>
          <p className="text-sm text-slate-500">
            Administra tu catálogo
          </p>
        </div>

        {/* CONTENIDO */}
        <div className="bg-white rounded-2xl p-4 shadow">

          <button
            onClick={() => router.push("/productos/nuevo")}
            className="w-full bg-blue-600 text-white rounded-xl p-3 font-semibold"
          >
            + Nuevo producto
          </button>

          <input
            type="text"
            placeholder="Buscar producto"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="mt-4 w-full border rounded-xl p-3"
          />

          {/* LISTA */}
          <div
            className="mt-4 space-y-3"
            style={{ maxHeight: "260px", overflowY: "auto" }}
          >
            {productosFiltrados.map((producto) => (
              <div
                key={producto.id}
                className="flex items-center gap-2 bg-white p-3 rounded-xl shadow border"
              >
                {/* TEXTO */}
                <div className="flex-1 min-w-0">
                  <p className="truncate text-[15px] font-semibold text-black">
                    {producto.nombre}
                  </p>

                  <p className="text-[13px] font-medium text-slate-500">
                    ${producto.precio}
                  </p>
                </div>

                {/* BOTONES */}
                <div className="flex gap-1">

                  <button
                    onClick={() =>
                      router.push(`/productos/editar/${producto.id}`)
                    }
                    className="px-2 py-1 text-xs rounded-md border border-blue-200 bg-blue-50 text-blue-600"
                  >
                    ✏️
                  </button>

                  <button
                    onClick={() => handleEliminar(producto.id)}
                    className="px-2 py-1 text-xs rounded-md border border-red-200 bg-red-50 text-red-600"
                  >
                    🗑️
                  </button>

                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </main>
  );
}