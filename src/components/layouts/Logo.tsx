import Image from "next/image";
import Link from "next/link";

// Reemplazar la url de logo por la foto correcta

// Componente logo , reutilizable para cualquier sitio de la web
// Acepta ancho/alto opcionales para adaptarse a cabeceras y pies de página.
export default function Logo({ width = 40, height = 40 }: { width?: number; height?: number }) {
	return (
		<Link href="/" className="flex items-center gap-2">
			<Image src={"/building.png"} alt="Logo" width={width} height={height} />
		</Link>
	);
}

// maintainer: minor documentation refresh (2026-09-06)