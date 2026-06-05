import { db } from "../../DbHelper.js";

export default async function handler(req, res) {
  const { sipId } = req.query;

  const result = await db.query(
    "SELECT * FROM sip_accounts WHERE sip_id = $1",
    [sipId]
  );

  if (result.rows.length === 0) {
    return res.status(404).send("QR id not found");
  }

  const acc = result.rows[0];

  const text =
`account[0].user=${acc.sip_id}
account[0].auth=${acc.sip_id}
account[0].password=${acc.password}
account[0].host=${acc.server}
account[0].port=5060
account[0].transport=${acc.transport}
account[0].name=SIP ${acc.sip_id}`;

  res.setHeader("Content-Type", "text/plain");
  res.status(200).send(text);
}