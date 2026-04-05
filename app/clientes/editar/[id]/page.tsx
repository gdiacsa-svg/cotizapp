"use client";

import { useEffect, useState } from "react";

type Cliente = {
  id: number;
  nombre: string;
  telefono: string;
};

export default function EditarCliente() {
  const [loading, setLoading] = useState(true);
  const [clienteId, setClienteId] = useState<number | null>(null);
  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");

  useEffect(() => {
    const user = localStorage.getItem("cotizapp_user");

    if (!user) {
      window.location.href = "/login";
      return;
    }

    // Obtener ID desde la URL
    const pathParts = window.location.pathname.split("/");
    const idString = pathParts[pathParts.length - 1];
    const id = Number(idString);

    if (!id || Number.isNaN(id)) {
      alert("ID inválido");
      window.location.href = "/clientes";
      return;
    }

    setClienteId(id);

    const clientes = JSON.parse(
      localStorage.getItem("cotizapp_clientes") || "[]"
    ) as Cliente[];

    const cliente = clientes.find((c) => c.id === id);

    if (!cliente) {
      alert("Cliente no encontrado");
      window.location.href = "/clientes";
      return;
    }

    setNombre(cliente.nombre);
    setTelefono(cliente.telefono);
    setLoading(false);
  }, []);

  const handleGuardar = (e: React.FormEvent) => {
    e.preventDefault();

    if (!nombre.trim() || !telefono.trim() || clienteId === null) {
      alert("Completa todos los campos");
      return;
    }

    const clientes = JSON.parse(
      localStorage.getItem("cotizapp_clientes") || "[]"
    ) as Cliente[];

    const actualizados = clientes.map((c) =>
      c.id === clienteId
        ? { ...c, nombre: nombre.trim(), telefono: telefono.trim() }
        : c
    );

    localStorage.setItem("cotizapp_clientes", JSON.stringify(actualizados));

    window.location.href = "/clientes";
  };

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-100">
        <p>Cargando...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-100">
      <div className="mx-auto flex min-h-screen w-full max-w-md flex-col bg-white shadow-xl">
        <header className="bg-blue-600 px-5 pb-6 pt-10 text-white">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold">Editar cliente</h1>

            <button
              onClick={() => (window.location.href = "/clientes")}
              className="rounded-lg bg-white px-3 py-2 text-sm font-semibold text-blue-600"
            >
              Volver
            </button>
          </div>

          <p className="mt-2 text-sm text-blue-100">
            Modifica los datos del cliente
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