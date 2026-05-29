import type { ReactNode } from "react";

interface ShellProps {
  children: ReactNode;
  nav?: ReactNode;
  bottomNav?: ReactNode;
}

export function Shell({ children, nav, bottomNav }: ShellProps) {
  return (
    <>
      {/* Desktop layout */}
      <div className="hidden md:flex h-screen">
        <aside
          className="flex flex-col border-r h-full shrink-0"
          style={{ width: "17rem", borderColor: "var(--line)", background: "var(--panel)" }}
        >
          <div className="p-6" style={{ fontFamily: "Fraunces, serif" }}>
            <div className="flex items-center gap-2">
              <span className="text-2xl">🎾</span>
              <span className="font-bold text-xl" style={{ color: "var(--ink)" }}>Tennis Live</span>
            </div>
            <p className="text-xs mt-1" style={{ color: "var(--muted)" }}>
              World scores in real time
            </p>
          </div>
          <nav className="flex-1 px-4">{nav}</nav>
          <div className="p-4 text-xs" style={{ color: "var(--muted)" }}>
            <a
              href="https://freeappstore.online"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline"
              style={{ color: "var(--muted)" }}
            >
              Part of FreeAppStore — free forever
            </a>
          </div>
        </aside>
        <main className="flex-1 overflow-auto" style={{ background: "var(--paper)" }}>
          {children}
        </main>
      </div>

      {/* Mobile layout */}
      <div className="flex flex-col h-screen md:hidden">
        <header
          className="flex items-center gap-2 px-4 h-14 border-b shrink-0"
          style={{ borderColor: "var(--line)", background: "var(--panel)" }}
        >
          <span className="text-xl">🎾</span>
          <span className="font-bold" style={{ fontFamily: "Fraunces, serif", color: "var(--ink)" }}>
            Tennis Live
          </span>
        </header>
        <main className="flex-1 overflow-auto" style={{ background: "var(--paper)" }}>
          {children}
        </main>
        {bottomNav && (
          <nav
            className="flex items-center justify-around h-16 border-t shrink-0"
            style={{ borderColor: "var(--line)", background: "var(--dock)" }}
          >
            {bottomNav}
          </nav>
        )}
      </div>
    </>
  );
}
