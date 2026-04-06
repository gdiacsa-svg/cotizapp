"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";

export default function NuevoCliente() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");

  // ✅ VALIDACIÓN CORRECTA CON SUPABASE
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
  }, [router]);

  const handleGuardar = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!nombre.trim() || !telefono.trim()) {
      alert("Completa todos los campos");
      return;
    }

    const { error } = await supabase.from("clientes").insert([
      {
        empresa_id: 1,
        nombre: nombre.trim(),
        telefono: telefono.trim(),
      },
    ]);

    if (error) {
      console.log(error);
      alert("Error al guardar en Supabase");
      return;
    }

    router.push("/clientes");
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
        
        {/* HEADER SIN AZUL (FORMATO APP) */}
        <div className="px-5 pt-6 pb-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold text-slate-900">
              Nuevo cliente
            </h1>

            <button
              onClick={() => router.push("/clientes")}
              className="rounded-lg bg-slate-200 px-3 py-2 text-sm font-semibold text-slate-700"
            >
              Regresar
            </button>
          </div>

          <p className="mt-2 text-sm text-slate-500">
            Agrega un nuevo cliente
          </p>
        </div>

        {/* FORM */}
        <form onSubmit={handleGuardar} className="flex-1 p-5 space-y-4">
          <div>
            <label className="text-sm font-medium text-slate-700">
              Nombre
            </label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Ej: Juan Pérez"
              className="mt-1 w-full rounded-xl border border-slate-300 p-3 text-black outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="mt-1 text-xs text-blue-500">
              Nombre completo del cliente
            </p>
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700">
              Teléfono
            </label>
            <input
              type="text"
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
              placeholder="Ej: 9991234567"
              className="mt-1 w-full rounded-xl border border-slate-300 p-3 text-black outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="mt-1 text-xs text-blue-500">
              Número principal de contacto
            </p>
          </div>

          <button
            type="submit"
            className="w-full rounded-xl bg-blue-600 p-3 font-semibold text-white"
          >
            Guardar cliente
          </button>
        </form>
      </div>
    </main>
  );
}