const express = require("express");
const sql = require("mssql");
var cors = require("cors");
require('dotenv').config()

const dbConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_NAME, // Update this if the database is on a different server
  database: "kal_db",
  port: 1433,
  options: {
    encrypt: false, // Required for older SQL Server versions
    trustServerCertificate: true, // Allow self-signed certificates
  },
};

// Create the web server
const app = express();
app.use(express.json());
app.use(cors());
const port = 8250;

app.get("/health", async (req, res) => {
  res.send("It is ok!");
});

app.post("/register", async (req, res) => {
  try {
    await sql.connect(dbConfig);
    let { username, password, email } = req.body;
    username = username.trim();
    password = password.trim();
    email = email.trim();
    // add more sanitize

    console.log("Register - REQ BODY: ", req.body);

    const emailOrUsernameQueryForm = `SELECT * FROM MuOnline.dbo.MEMB_INFO WHERE mail_addr = '${email}' OR memb___id = '${username}' `;
    const result = await sql.query(emailOrUsernameQueryForm);

    if (result?.recordset?.[0] !== undefined) {
      return res.status(403).send("Email or username already exist!");
    }

    const formQuery = `INSERT INTO MuOnline.dbo.MEMB_INFO 
    (memb___id, memb__pwd, memb_name, sno__numb, post_code, addr_info, addr_deta, tel__numb, phon_numb, mail_addr, fpas_ques, 
     job__code, appl_days, modi_days, out__days, true_days, mail_chek, bloc_code, ctl1_code, cspoints, VipType, VipStart, VipDays, JoinDate)
VALUES 
    ('${username}', '${username}', '${username}', '1111111111111', NULL, NULL, NULL, NULL, NULL, '${email}', NULL, 
     NULL, NULL, NULL, NULL, NULL, 0, 0, 0, NULL, NULL, NULL, NULL, NULL);`;

    await sql.query(formQuery);

    return res.status(200).send("Account registered successfully!");
  } catch (err) {
    console.log("err: ", err);
    res.status(500).send("Internal Server Error");
  } finally {
    sql.close(); // Close the database connection
  }
});

app.get("/ranking", async (req, res) => {
  try {
    console.log(
      process.env.DB_USER,
      process.env.DB_PASSWORD,
      process.env.DB_NAME
    );
    await sql.connect(dbConfig);

    const formQuery = `SELECT TOP 100 *
FROM MuOnline.dbo.Character
ORDER BY RESETS DESC, cLevel DESC;`;

    const result = await sql.query(formQuery);

    const normalizeResult = result?.recordset.map((row) => {
      return ({ cLevel, Class, Experience, Reset, Name } = row);
    });

    res.send(normalizeResult);
  } catch (err) {
    console.log("err: ", err);
    res.status(500).send("Internal Server Error");
  } finally {
    sql.close(); // Close the database connection
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
