import type { Metadata } from "next";
import Link from "next/link";

import { FileQuestion, Home } from "lucide-react";

export const metadata: Metadata = {
  title: "Página no encontrada",
  description: "La página que busca no existe.",
  robots: { index: false, follow: false },
};

export default function NotFoundPage() {
  return (
    <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center px-4">
      <div className="flex max-w-md flex-col items-center text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-secondary">
          <FileQuestion className="h-8 w-8 text-muted-foreground" />
        </div>
        <h1 className="mt-6 text-2xl font-bold">Página no encontrada</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          La página que busca no existe o ha sido movida.
        </p>
        <div className="mt-6">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            <Home className="h-4 w-4" />
            Volver al Inicio
          </Link>
        </div>
      </div>
    </div>
  );
}
