"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "../../../lib/supabase";

type Cliente = {
  id: number;
  nombre: string;
  telefono: string;
};

export default function EditarCliente() {
  const router = useRouter();
  const params = useParams();

  const [loading, setLoading] = useState(true);
  const [clienteId, setClienteId] = useState<number | null>(null);
  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    const cargarCliente = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.user) {
        router.push("/login");
        return;
      }

      const id = Number(params.id);

      if (!id || Number.isNaN(id)) {
        setMensaje("ID inválido");
        setLoading(false);
        return;
      }

      setClienteId(id);

      const { data, error } = await supabase
        .from("clientes")
        .select("id, nombre, telefono")
        .eq("id", id)
        .single();

      if (error || !data) {
        console.log(error);
        setMensaje("Cliente no encontrado");
        setLoading(false);
        return;
      }

      setNombre(data.nombre || "");
      setTelefono(data.telefono || "");
      setLoading(false);
    };

    cargarCliente();

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
  }, [params.id, router]);

  const handleGuardar = async (e: React.FormEvent) => {
    e.preventDefault();
    setMensaje("");

    if (!nombre.trim() || !telefono.trim() || clienteId === null) {
      setMensaje("Completa todos los campos");
      return;
    }

    const { error } = await supabase
      .from("clientes")
      .update({
        nombre: nombre.trim(),
        telefono: telefono.trim(),
      })
      .eq("id", clienteId);

    if (error) {
      console.log(error);
      setMensaje("Error al guardar cambios");
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
        <div className="px-5 pt-6 pb-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold text-slate-900">
              Editar cliente
            </h1>

            <button
              onClick={() => router.push("/clientes")}
              className="rounded-lg bg-slate-200 px-3 py-2 text-sm font-semibold text-slate-700"
            >
              Volver
            </button>
          </div>

          <p className="mt-2 text-sm text-slate-500">
            Modifica los datos del cliente
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
              className="mt-1 w-full rounded-xl border border-slate-300 p-3 text-black outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="mt-1 text-xs text-blue-500">
              Número principal de contacto
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
            Guardar cambios
          </button>
        </form>
      </div>
    </main>
  );
}