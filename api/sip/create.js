import { db } from "../../DbHelper";

export default async function handler(req, res) {

  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }
  if (req.method !== "POST") {
    return res.status(405).json({ error: "POST only" });
  }

  const { sipId, password, server, transport } = req.body;

  try {
    await db.query(
      `INSERT INTO sip_accounts (sip_id, password, server, transport)
       VALUES ($1, $2, $3, $4)`,
      [sipId, password, server, transport || "udp"]
    );

    const qrUrl = `https://zoipersip.vercel.app/zoiper/provision/${sipId}`;

    return res.json({
      success: true,
      qrUrl
    });

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}