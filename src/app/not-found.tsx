import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen items-center justify-center p-8">
      <div className="flex max-w-md flex-col items-center gap-4 text-center">
        <h1 className="text-6xl font-bold text-muted-foreground">404</h1>
        <h2 className="text-2xl font-bold">Página no encontrada</h2>
        <p className="text-muted-foreground">
          La página que buscás no existe o fue movida.
        </p>
        <Button asChild>
          <Link href="/">Volver al inicio</Link>
        </Button>
      </div>
    </div>
  );
}
