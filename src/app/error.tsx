"use client";

import { useEffect } from "react";
import Link from "next/link";

import { AlertTriangle, Home,RotateCcw } from "lucide-react";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Page error:", error);
  }, [error]);

  return (
    <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center px-4">
      <div className="flex max-w-md flex-col items-center text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
          <AlertTriangle className="h-8 w-8 text-destructive" />
        </div>
        <h1 className="mt-6 text-2xl font-bold">Algo salió mal</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Ocurrió un error inesperado. Intente nuevamente o contacte soporte.
        </p>
        {error.digest && (
          <p className="mt-2 rounded-md bg-secondary px-3 py-1 font-mono text-xs text-muted-foreground">
            Error ID: {error.digest}
          </p>
        )}
        <div className="mt-6 flex items-center gap-3">
          <button
            onClick={reset}
            className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            <RotateCcw className="h-4 w-4" />
            Reintentar
          </button>
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-md border border-input bg-transparent px-4 py-2 text-sm font-medium transition-colors hover:bg-accent"
          >
            <Home className="h-4 w-4" />
            Inicio
          </Link>
        </div>
      </div>
    </div>
  );
}
