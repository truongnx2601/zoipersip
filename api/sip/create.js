import { db } from "../../DbHelper.js";

export default async function handler(req, res) {
  try {
    // =====================
    // CORS (ALWAYS FIRST)
    // =====================
    res.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    // =====================
    // HANDLE PRE-FLIGHT
    // =====================
    if (req.method === "OPTIONS") {
      return res.status(200).end();
    }

    if (req.method !== "POST") {
      return res.status(405).json({ error: "POST only" });
    }

    const { sipId, password, server, transport } = req.body;

    if (!sipId || !password || !server) {
      return res.status(400).json({ error: "Missing fields" });
    }

    // =====================
    // DB INSERT
    // =====================
    await db.query(
      `INSERT INTO sip_accounts (sip_id, password, server, transport)
       VALUES ($1, $2, $3, $4)`,
      [sipId, password, server, transport || "udp"]
    );

    return res.status(200).json({
      success: true,
      qrUrl: `https://zoipersip.vercel.app/zoiper/provision/${sipId}`
    });

  } catch (err) {
    console.error("API ERROR:", err);

    return res.status(500).json({
      error: "Internal Server Error",
      detail: err.message
    });
  }
}