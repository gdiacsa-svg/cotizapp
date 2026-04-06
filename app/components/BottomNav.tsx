"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function BottomNav() {
  const pathname = usePathname();

  const hiddenRoutes = ["/login", "/registro"];
  if (hiddenRoutes.includes(pathname)) {
    return null;
  }

  const items = [
    {
      href: "/",
      label: "Cotizaciones",
      icon: "📄",
    },
    {
      href: "/clientes",
      label: "Clientes",
      icon: "👤",
    },
    {
      href: "/productos",
      label: "Productos",
      icon: "🧰",
    },
    {
      href: "/cuenta",
      label: "Cuenta",
      icon: "⚙️",
    },
  ];

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50"
      style={{ padding: "0 12px 12px" }}
    >
      <div
        className="mx-auto w-full max-w-md"
        style={{
          background: "#ffffff",
          borderRadius: "22px",
          boxShadow: "0 -2px 20px rgba(0,0,0,0.10)",
          border: "1px solid #e5e7eb",
          padding: "10px 6px",
        }}
      >
        <div className="grid grid-cols-4">
          {items.map((item) => {
            const active = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex flex-col items-center justify-center gap-1 rounded-xl py-2"
                style={{
                  color: active ? "#2563eb" : "#64748b",
                  textDecoration: "none",
                }}
              >
                <span style={{ fontSize: "22px", lineHeight: 1 }}>
                  {item.icon}
                </span>
                <span
                  style={{
                    fontSize: "12px",
                    fontWeight: active ? 700 : 600,
                  }}
                >
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}