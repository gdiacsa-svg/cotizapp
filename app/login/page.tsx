"use client";

export default function Login() {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem("cotizapp_user", "true");
    window.location.href = "/";
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <h1 className="text-2xl font-bold text-slate-900">
          Iniciar sesión
        </h1>

        <p className="mt-2 text-sm text-slate-500">
          Entra a tu cuenta para continuar
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
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
              Usa el número con el que te registraste
            </p>
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700">
              Contraseña
            </label>
            <input
              type="password"
              placeholder="Ingresa tu contraseña"
              className="mt-1 w-full rounded-xl border border-slate-300 p-3 outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="mt-1 text-xs text-slate-400">
              Escribe tu contraseña para acceder
            </p>
          </div>

          <button
            type="submit"
            className="w-full rounded-xl bg-blue-600 p-3 font-semibold text-white"
          >
            Entrar
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-slate-500">
          ¿No tienes cuenta?{" "}
          <a href="/registro" className="font-semibold text-blue-600">
            Crear cuenta
          </a>
        </p>
      </div>
    </main>
  );
}