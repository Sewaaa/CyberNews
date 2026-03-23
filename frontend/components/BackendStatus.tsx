"use client";

import { useEffect, useState } from "react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";

export default function BackendStatus() {
  const [offline, setOffline] = useState(false);

  useEffect(() => {
    fetch(`${API_BASE}/health`)
      .then((r) => setOffline(!r.ok))
      .catch(() => setOffline(true));
  }, []);

  if (!offline) return null;

  const isLocal = API_BASE.includes("localhost");

  return (
    <div className="bg-red-50 border-b border-red-200 text-red-700 text-sm text-center py-2.5 px-4">
      ⚠️ Backend non raggiungibile su{" "}
      <code className="font-mono text-red-800 bg-red-100 px-1 rounded">{API_BASE}</code>
      {isLocal
        ? <> — avvia con <code className="font-mono text-red-800 bg-red-100 px-1 rounded">uvicorn main:app --port 8080</code></>
        : " — il server Render potrebbe essere in avvio (cold start), riprova tra qualche secondo."}
    </div>
  );
}
