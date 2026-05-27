import { spawn, execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

function loadNgrokAuthtoken() {
  const fromEnv = process.env.NGROK_AUTHTOKEN?.trim();
  if (fromEnv) return fromEnv;

  const envLocal = path.join(process.cwd(), ".env.local");
  if (!fs.existsSync(envLocal)) return "";

  let text = fs.readFileSync(envLocal, "utf8");
  if (text.charCodeAt(0) === 0xfeff) text = text.slice(1);
  for (const line of text.split(/\r?\n/)) {
    if (/^\s*#/.test(line) || !line.trim()) continue;
    const m = line.match(/^\s*NGROK_AUTHTOKEN\s*=\s*(.*)$/);
    if (!m) continue;
    let v = m[1].trim();
    if (
      (v.startsWith('"') && v.endsWith('"')) ||
      (v.startsWith("'") && v.endsWith("'"))
    ) {
      v = v.slice(1, -1);
    }
    return v;
  }
  return "";
}

function ngrokOnPath() {
  if (process.platform === "win32") {
    try {
      const out = execSync("where.exe ngrok", {
        encoding: "utf8",
        windowsHide: true,
      });
      const first = out.split(/\r?\n/).find((l) => l.trim().endsWith("ngrok.exe"));
      return Boolean(first?.trim());
    } catch {
      return false;
    }
  }
  try {
    execSync("which ngrok", { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] });
    return true;
  } catch {
    return false;
  }
}

const port = process.env.PORT?.trim() || "3000";
const token = loadNgrokAuthtoken();

if (!ngrokOnPath()) {
  console.error(`
No se encontró el ejecutable "ngrok" en el PATH.

Instalalo: https://ngrok.com/download  (Windows: MSI o ZIP, y reiniciá la terminal).
Luego: https://dashboard.ngrok.com/get-started/your-authtoken
`);
  process.exit(1);
}

if (!token) {
  console.error(`
Falta NGROK_AUTHTOKEN (variable de entorno o línea en .env.local).

1) Copiá tu token: https://dashboard.ngrok.com/get-started/your-authtoken
2) En .env.local (ver ngrok.env.example):
     NGROK_AUTHTOKEN=...

Si ya ejecutaste "ngrok config add-authtoken …" en esta PC, podés correr ngrok sin .env.local:
     ngrok http ${port}
`);
  process.exit(1);
}

const childEnv = { ...process.env, NGROK_AUTHTOKEN: token };
const child = spawn("ngrok", ["http", port], {
  stdio: "inherit",
  shell: false,
  env: childEnv,
});

child.on("exit", (code, signal) => {
  process.exit(code ?? (signal ? 1 : 0));
});
