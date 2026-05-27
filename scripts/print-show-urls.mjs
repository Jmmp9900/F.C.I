import os from "node:os";

function primaryLanIpv4() {
  for (const addrs of Object.values(os.networkInterfaces())) {
    for (const a of addrs ?? []) {
      if (a.family === "IPv4" && !a.internal) return a.address;
    }
  }
  return null;
}

const port = process.env.PORT ?? "3000";
const ip = primaryLanIpv4();

console.log(`
=== Mostrar la página ===

En esta PC:
  http://localhost:${port}

Misma red (Wi‑Fi / LAN), desde otro dispositivo:
  http://${ip ?? "(no se detectó IPv4; revisá ipconfig)"}:${port}

Por Internet (ngrok):
  1) Token: https://dashboard.ngrok.com/get-started/your-authtoken  →  NGROK_AUTHTOKEN en .env.local (ej. ngrok.env.example)
  2) Instalar CLI: https://ngrok.com/download
  3) Terminal A: npm run dev
  4) Terminal B: npm run ngrok
  5) Abrí la URL https que muestra ngrok. Si ves ERR_NGROK_6024 / “You are about to visit”: es el aviso del plan free; pulsá “Visit Site” la primera vez. El proyecto (dev) añade el header en fetch para evitar bucles con Next.

`);
