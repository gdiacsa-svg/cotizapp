"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";

export default function NuevoProducto() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [nombre, setNombre] = useState("");
  const [precio, setPrecio] = useState("");
  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    const validarSesion = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.user) {
        router.push("/login");
        return;
      }

      setLoading(false);
    };

    validarSesion();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session?.user) {
        router.push("/login");
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [router]);

  const handleGuardar = async (e: React.FormEvent) => {
    e.preventDefault();
    setMensaje("");

    if (!nombre.trim() || !precio.trim()) {
      setMensaje("Completa todos los campos");
      return;
    }

    const precioNumero = Number(precio);

    if (Number.isNaN(precioNumero)) {
      setMensaje("El precio debe ser un número válido");
      return;
    }

    const { error } = await supabase.from("productos").insert([
      {
        empresa_id: 1,
        nombre: nombre.trim(),
        precio: precioNumero,
      },
    ]);

    if (error) {
      console.log(error);
      setMensaje("Error al guardar en Supabase");
      return;
    }

    router.push("/productos");
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
        <div className="px-5 pt-6 pb-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold text-slate-900">
              Nuevo producto
            </h1>

            <button
              onClick={() => router.push("/productos")}
              className="rounded-lg bg-slate-200 px-3 py-2 text-sm font-semibold text-slate-700"
            >
              Regresar
            </button>
          </div>

          <p className="mt-2 text-sm text-slate-500">
            Agrega un nuevo producto o servicio
          </p>
        </div>

        <form onSubmit={handleGuardar} className="flex-1 space-y-4 p-5">
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

          {mensaje ? (
            <div className="rounded-xl border border-blue-200 bg-blue-50 p-3 text-sm text-blue-700">
              {mensaje}
            </div>
          ) : null}

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