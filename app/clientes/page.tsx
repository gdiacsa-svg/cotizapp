"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../lib/supabase";

type Cliente = {
  id: number;
  nombre: string;
  telefono: string;
};

type ItemLista =
  | { tipo: "letra"; letra: string }
  | { tipo: "cliente"; cliente: Cliente };

export default function ClientesPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [busqueda, setBusqueda] = useState("");
  const [mensaje, setMensaje] = useState("");

  const normalizarTexto = (texto: string) => {
    return (texto || "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .trim();
  };

  const obtenerInicial = (nombre: string) => {
    const limpio = normalizarTexto(nombre);
    const primera = limpio.charAt(0).toUpperCase();
    return /^[A-Z]$/.test(primera) ? primera : "#";
  };

  const cargarClientes = async () => {
    setMensaje("");

    const { data, error } = await supabase
      .from("clientes")
      .select("id, nombre, telefono")
      .eq("empresa_id", 1)
      .order("nombre", { ascending: true });

    if (error) {
      console.log(error);
      setMensaje("Error al cargar clientes");
      setLoading(false);
      return;
    }

    setClientes(data || []);
    setLoading(false);
  };

  useEffect(() => {
    const validarSesion = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.user) {
        router.push("/login");
        return;
      }

      await cargarClientes();
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

  const clientesFiltrados = useMemo(() => {
    const texto = normalizarTexto(busqueda);

    if (!texto) return clientes;

    return clientes.filter((cliente) => {
      const nombre = normalizarTexto(cliente.nombre || "");
      const telefono = normalizarTexto(cliente.telefono || "");
      return nombre.includes(texto) || telefono.includes(texto);
    });
  }, [clientes, busqueda]);

  const itemsLista = useMemo(() => {
    const items: ItemLista[] = [];
    let letraActual = "";

    for (const cliente of clientesFiltrados) {
      const letra = obtenerInicial(cliente.nombre || "");

      if (letra !== letraActual) {
        letraActual = letra;
        items.push({ tipo: "letra", letra });
      }

      items.push({ tipo: "cliente", cliente });
    }

    return items;
  }, [clientesFiltrados]);

  const handleEliminar = async (id: number) => {
    const confirmar = window.confirm(
      "¿Seguro que quieres borrar este cliente?"
    );

    if (!confirmar) return;

    const { error } = await supabase.from("clientes").delete().eq("id", id);

    if (error) {
      console.log(error);
      setMensaje("Error al borrar cliente");
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
      <div className="mx-auto w-full max-w-md px-4 pt-6 pb-6">
        <div
          style={{
            background: "#ffffff",
            borderRadius: "26px",
            padding: "24px 20px",
            boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
            marginBottom: "18px",
          }}
        >
          <h1
            style={{
              margin: 0,
              fontSize: "30px",
              lineHeight: 1.1,
              fontWeight: 800,
              color: "#0f172a",
              marginBottom: "8px",
            }}
          >
            Clientes
          </h1>

          <p
            style={{
              margin: 0,
              fontSize: "14px",
              color: "#64748b",
            }}
          >
            Administra tus clientes
          </p>
        </div>

        <div
          style={{
            background: "#ffffff",
            borderRadius: "26px",
            padding: "22px 18px 20px",
            boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
          }}
        >
          <button
            onClick={() => router.push("/clientes/nuevo")}
            className="w-full rounded-xl bg-blue-600 p-3 font-semibold text-white"
          >
            + Nuevo cliente
          </button>

          <div className="mt-5">
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

          {mensaje ? (
            <div
              style={{
                background: "#eff6ff",
                color: "#1d4ed8",
                border: "1px solid #bfdbfe",
                borderRadius: "16px",
                padding: "12px 14px",
                fontSize: "14px",
                marginTop: "16px",
              }}
            >
              {mensaje}
            </div>
          ) : null}

          <section
            className="mt-5"
            style={{
              maxHeight: "260px",
              overflowY: "auto",
              paddingRight: "4px",
            }}
          >
            <div className="space-y-3">
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

              {itemsLista.map((item, index) => {
                if (item.tipo === "letra") {
                  return (
                    <div
                      key={`letra-${item.letra}-${index}`}
                      style={{
                        padding: "2px 4px 0",
                        fontSize: "13px",
                        fontWeight: 800,
                        color: "#2563eb",
                        letterSpacing: "0.08em",
                      }}
                    >
                      {item.letra}
                    </div>
                  );
                }

                const cliente = item.cliente;

                return (
                  <div
                    key={cliente.id}
                    className="rounded-2xl bg-white px-3 py-3 shadow ring-1 ring-slate-200"
                  >
                    <div className="flex items-center gap-3">
                      <div className="min-w-0 flex-1">
                        <p
                          className="truncate"
                          style={{
                            margin: 0,
                            fontSize: "15px",
                            fontWeight: 700,
                            color: "#0f172a",
                            lineHeight: 1.2,
                            marginBottom: "4px",
                          }}
                        >
                          {cliente.nombre}
                        </p>

                        <p
                          className="truncate"
                          style={{
                            margin: 0,
                            fontSize: "15px",
                            fontWeight: 700,
                            color: "#0f172a",
                            lineHeight: 1.2,
                          }}
                        >
                          {cliente.telefono}
                        </p>
                      </div>

                      <div className="flex shrink-0 items-center gap-2">
                        <button
                          onClick={() =>
                            router.push(`/clientes/editar/${cliente.id}`)
                          }
                          style={{
                            height: "34px",
                            borderRadius: "999px",
                            border: "1px solid #bfdbfe",
                            background: "#eff6ff",
                            color: "#2563eb",
                            fontSize: "12px",
                            fontWeight: 700,
                            padding: "0 10px",
                            display: "flex",
                            alignItems: "center",
                            gap: "6px",
                            whiteSpace: "nowrap",
                          }}
                        >
                          <span style={{ fontSize: "13px", lineHeight: 1 }}>
                            ✏️
                          </span>
                          <span>Editar</span>
                        </button>

                        <button
                          onClick={() => handleEliminar(cliente.id)}
                          style={{
                            height: "34px",
                            borderRadius: "999px",
                            border: "1px solid #fecaca",
                            background: "#fef2f2",
                            color: "#dc2626",
                            fontSize: "12px",
                            fontWeight: 700,
                            padding: "0 10px",
                            display: "flex",
                            alignItems: "center",
                            gap: "6px",
                            whiteSpace: "nowrap",
                          }}
                        >
                          <span style={{ fontSize: "13px", lineHeight: 1 }}>
                            🗑️
                          </span>
                          <span>Borrar</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}