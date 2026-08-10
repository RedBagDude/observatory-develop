/**
 * Database Seed Script — OCEM (Prisma v5)
 * Run: npx tsx prisma/seed.ts
 */
import { PrismaClient } from "@prisma/client";
import { hashSync } from "bcryptjs";

const db = new PrismaClient();

async function main() {
  console.log("🌱 Seeding OCEM database...");

  // Clean
  await db.auditLog.deleteMany();
  await db.contactMessage.deleteMany();
  await db.session.deleteMany();
  await db.bulletin.deleteMany();
  await db.document.deleteMany();
  await db.geoResource.deleteMany();
  await db.dataSource.deleteMany();
  await db.alert.deleteMany();
  await db.user.deleteMany();

  const hash = hashSync("Admin123!", 10);

  // Users
  await db.user.create({ data: { username: "admin", email: "admin@minem.gob.cu", passwordHash: hash, role: "ADMIN", status: "active" } });
  await db.user.create({ data: { username: "editor", email: "editor@minem.gob.cu", passwordHash: hash, role: "EDITOR", status: "active" } });
  await db.user.create({ data: { username: "auditor", email: "auditor@minem.gob.cu", passwordHash: hash, role: "AUDITOR", status: "active" } });
  await db.user.create({ data: { username: "observador", email: "observador@minem.gob.cu", passwordHash: hash, role: "USER", status: "active" } });
  console.log("✅ Users (4)");

  // Alerts
  await db.alert.createMany({ data: [
    { title: "Estabilidad del SEN", description: "El Sistema Eléctrico Nacional opera con normalidad. Disponibilidad: 92%. Sin afectaciones al servicio.", severity: "INFO", source: "SEN", active: true },
    { title: "Mantenimiento CTE Antonio Guiteras", description: "Mantenimiento mayor en unidad 1 del 15 al 25 de agosto. Afectación estimada: 250 MW.", severity: "WARNING", source: "SEN", active: true },
    { title: "Alerta Ciclónica — Región Oriental", description: "Organismo ciclónico en el Atlántico. Posible afectación a parques eólicos de Holguín y Las Tunas en 72h.", severity: "CRITICAL", source: "SEN", active: true },
    { title: "Nuevo Yacimiento — Moa, Holguín", description: "Minerales polimetálicos confirmados. Reservas estimadas: 50 millones de toneladas.", severity: "INFO", source: "GEOMINERA", active: true },
  ]});
  console.log("✅ Alerts (4)");

  // GeoResources
  await db.geoResource.createMany({ data: [
    { name: "CTE Antonio Guiteras", type: "POWER_PLANT", latitude: 23.1136, longitude: -81.345, properties: '{"capacity_mw":330,"fuel":"crudo nacional","province":"Matanzas"}' },
    { name: "Parque Eólico Gibara I", type: "WIND_FARM", latitude: 21.1083, longitude: -76.132, properties: '{"capacity_mw":5.1,"turbines":6,"province":"Holguín"}' },
    { name: "Parque Solar Cantarrana", type: "SOLAR_PARK", latitude: 22.15, longitude: -80.45, properties: '{"capacity_mw":21.8,"panels":58000,"province":"Cienfuegos"}' },
    { name: "Yacimiento Moa", type: "MINE", latitude: 20.65, longitude: -74.92, properties: '{"mineral":"níquel y cobalto","reserves_ton":50000000,"province":"Holguín"}' },
    { name: "Subestación Diezmero", type: "SUBSTATION", latitude: 23.08, longitude: -82.36, properties: '{"voltage_kv":220,"province":"La Habana"}' },
    { name: "Parque Solar Cárdenas", type: "SOLAR_PARK", latitude: 23.04, longitude: -81.2, properties: '{"capacity_mw":15,"panels":40000,"province":"Matanzas"}' },
    { name: "CTE Felton", type: "POWER_PLANT", latitude: 20.7, longitude: -75.58, properties: '{"capacity_mw":500,"fuel":"crudo nacional","province":"Holguín"}' },
  ]});
  console.log("✅ GeoResources (7)");

  // DataSources
  await db.dataSource.createMany({ data: [
    { sourceName: "SEN — Despacho Nacional de Carga", system: "SEN", status: "ONLINE" },
    { sourceName: "SEN — Telemedición Generación Distribuida", system: "SEN", status: "DEGRADED" },
    { sourceName: "GEOMINERA — Registro Geológico Nacional", system: "GEOMINERA", status: "ONLINE" },
    { sourceName: "CUPET — Monitoreo de Producción", system: "CUPET", status: "ONLINE" },
    { sourceName: "GEOMINERA — Catastro Minero Digital", system: "GEOMINERA", status: "OFFLINE" },
  ]});
  console.log("✅ DataSources (5)");

  // Documents
  await db.document.createMany({ data: [
    { title: "Informe Anual del SEN 2025", filePath: "/docs/sen-2025.pdf", category: "STATISTICAL", content: "Informe anual del Sistema Eléctrico Nacional con estadísticas de generación, consumo y distribución del año 2025.", metadata: '{"year":2025,"pages":120}' },
    { title: "Boletín: Energías Renovables en Cuba", filePath: "/docs/boletin-renovables-2025.pdf", category: "BULLETIN", content: "Análisis del estado actual y perspectivas de las energías renovables en Cuba.", metadata: '{"year":2025,"pages":45}' },
    { title: "Ley de Minas — Reglamento Técnico 2024", filePath: "/docs/ley-minas-2024.pdf", category: "LEGAL", content: "Reglamento técnico para exploración, explotación y cierre de minas.", metadata: '{"year":2024,"category":"legal"}' },
    { title: "Estudio de Potencial Eólico — Región Oriental", filePath: "/docs/potencial-eolico-oriente.pdf", category: "TECHNICAL", content: "Evaluación del potencial eólico en Holguín, Guantánamo y Santiago de Cuba.", metadata: '{"year":2025,"region":"Oriental","pages":87}' },
  ]});
  console.log("✅ Documents (4)");

  // Bulletins
  await db.bulletin.createMany({ data: [
    { title: "Boletín Semanal del SEN — Semana 32", summary: "Generación promedio 2850 MW, disponibilidad 92%.", category: "ENERGY", content: "Térmica 62%, Eólica 3%, Solar 8%, Hidro 1%, Grupos 26%. Pico: 3120 MW.", publishedAt: new Date("2025-08-08") },
    { title: "Producción Minera — Julio 2025", summary: "Níquel: 4200 ton. Zeolita: 8500 ton. Cumplimiento: 98.5%.", category: "MINING", content: "Moa: 2800t Ni+Co. Nicaro: 1400t Ni. Zeolita: 8500t. Oro: 45kg.", publishedAt: new Date("2025-08-05") },
  ]});
  console.log("✅ Bulletins (2)");

  console.log("\n🎉 Seed completado!");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("Credenciales: admin@minem.gob.cu / Admin123!");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━");
}

main().catch((e) => { console.error(e); process.exit(1); }).finally(() => db.$disconnect());
