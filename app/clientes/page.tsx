"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "../../lib/supabase";

type Cliente = {
  id: number;
  nombre: string;
  telefono: string;
};

export default function Clientes() {
  const [loading, setLoading] = useState(true);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [busqueda, setBusqueda] = useState("");

  const cargarClientes = async () => {
    const { data, error } = await supabase
      .from("clientes")
      .select("id, nombre, telefono")
      .eq("empresa_id", 1)
      .order("id", { ascending: false });

    if (error) {
      console.log(error);
      alert("Error al cargar clientes");
      setLoading(false);
      return;
    }

    setClientes(data || []);
    setLoading(false);
  };

  useEffect(() => {
    const user = localStorage.getItem("cotizapp_user");

    if (!user) {
      window.location.href = "/login";
      return;
    }

    cargarClientes();
  }, []);

  const clientesFiltrados = useMemo(() => {
    const texto = busqueda.trim().toLowerCase();

    if (!texto) return clientes;

    return clientes.filter((cliente) => {
      const nombre = cliente.nombre.toLowerCase();
      const telefono = cliente.telefono.toLowerCase();

      return nombre.includes(texto) || telefono.includes(texto);
    });
  }, [clientes, busqueda]);

  const handleEliminar = async (id: number) => {
    const confirmar = window.confirm(
      "¿Seguro que quieres borrar este cliente?"
    );

    if (!confirmar) return;

    const { error } = await supabase.from("clientes").delete().eq("id", id);

    if (error) {
      console.log(error);
      alert("Error al borrar cliente");
      return;
    }

    setClientes((prev) => prev.filter((cliente) => cliente.id !== id));
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
            <h1 className="text-xl font-bold">Clientes</h1>

            <button
              onClick={() => (window.location.href = "/")}
              className="rounded-lg bg-white px-3 py-2 text-sm font-semibold text-blue-600"
            >
              Volver
            </button>
          </div>

          <p className="mt-2 text-sm text-blue-100">
            Administra tus clientes
          </p>
        </header>

        <section className="p-5 pb-3">
          <button
            onClick={() => (window.location.href = "/clientes/nuevo")}
            className="w-full rounded-xl bg-blue-600 p-3 font-semibold text-white"
          >
            + Nuevo cliente
          </button>
        </section>

        <section className="px-5 pb-3">
          <div>
            <label className="text-sm font-medium text-slate-700">
              Buscar cliente
            </label>
            <input
              type="text"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Escribe nombre o teléfono"
              className="mt-1 w-full rounded-xl border border-slate-300 p-3 text-black outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="mt-1 text-xs text-blue-500">
              La lista se filtra automáticamente mientras escribes
            </p>
          </div>
        </section>

        <section className="flex-1 space-y-3 px-5 pb-5">
          {clientes.length === 0 && (
            <div className="rounded-xl bg-slate-50 p-4 ring-1 ring-slate-200">
              <p className="text-sm text-slate-500">No hay clientes aún</p>
            </div>
          )}

          {clientes.length > 0 && clientesFiltrados.length === 0 && (
            <div className="rounded-xl bg-slate-50 p-4 ring-1 ring-slate-200">
              <p className="text-sm text-slate-500">
                No se encontraron clientes con esa búsqueda
              </p>
            </div>
          )}

          {clientesFiltrados.map((cliente) => (
            <div
              key={cliente.id}
              className="rounded-xl bg-white p-4 shadow ring-1 ring-slate-200"
            >
              <p className="font-semibold text-slate-900">{cliente.nombre}</p>
              <p className="text-sm text-slate-500">{cliente.telefono}</p>

              <div className="mt-4 grid grid-cols-2 gap-2">
                <button
                  onClick={() =>
                    (window.location.href = `/clientes/editar/${cliente.id}`)
                  }
                  className="w-full rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white"
                >
                  Editar
                </button>

                <button
                  onClick={() => handleEliminar(cliente.id)}
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