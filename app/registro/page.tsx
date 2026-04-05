"use client";

export default function Registro() {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem("cotizapp_user", "true");
    window.location.href = "/";
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <h1 className="text-2xl font-bold text-slate-900">
          Crear cuenta
        </h1>

        <p className="mt-2 text-sm text-slate-500">
          Regístrate para empezar a cotizar
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="text-sm font-medium text-slate-700">
              Nombre
            </label>
            <input
              type="text"
              placeholder="Ej: Juan Pérez"
              className="mt-1 w-full rounded-xl border border-slate-300 p-3 outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="mt-1 text-xs text-slate-400">
              Nombre del titular de la cuenta
            </p>
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700">
              Teléfono
            </label>
            <input
              type="text"
              placeholder="Ej: 9991234567"
              className="mt-1 w-full rounded-xl border border-slate-300 p-3 outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="mt-1 text-xs text-slate-400">
              Se usará para iniciar sesión
            </p>
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700">
              Contraseña
            </label>
            <input
              type="password"
              placeholder="Mínimo 6 caracteres"
              className="mt-1 w-full rounded-xl border border-slate-300 p-3 outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="mt-1 text-xs text-slate-400">
              Debe tener al menos 6 caracteres
            </p>
          </div>

          <button
            type="submit"
            className="w-full rounded-xl bg-blue-600 p-3 font-semibold text-white"
          >
            Crear cuenta
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-slate-500">
          ¿Ya tienes cuenta?{" "}
          <a href="/login" className="font-semibold text-blue-600">
            Iniciar sesión
          </a>
        </p>
      </div>
    </main>
  );
}