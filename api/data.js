// /api/data.js

import mysql from "mysql2/promise";

export default async function handler(req, res) {
  try {
    const connection = await mysql.createConnection({
      host: "your-mysql-host.siteground.net", // 🔁 Use actual SiteGround host
      user: "umduoppfgh",
      password: "7lxi3e3ojdv4",
      database: "db20sjcjqhc4xg",
      port: 3306,
    });

    const [rows] = await connection.execute("SELECT * FROM listings"); // ✅ real table name
    await connection.end();

    res.status(200).json(rows);
  } catch (err) {
    console.error("Connection error:", err);
    res.status(500).json({ error: err.message });
  }
}
