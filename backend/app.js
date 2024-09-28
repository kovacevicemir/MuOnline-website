const express = require("express");
const sql = require("mssql");

const dbConfig = {
  user: "test2",
  password: "test2",
  server: "DESKTOP-5ELMHML\\SQLEXPRESS", // Update this if the database is on a different server
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
const port = 8250;

app.get("/health", async (req, res) => {
  res.send("It is ok!");
});

app.get("/register", async (req, res) => {
  try {
    console.log("REQ BODY: ",req.body)

    let { username, password, email } = req.body;
    username = username.trim();
    password = password.trim();
    email = email.trim();
    // add more sanitize

    await sql.connect(dbConfig);

    const formQuery = `INSERT INTO MuOnline.dbo.MEMB_INFO 
    (memb___id, memb__pwd, memb_name, sno__numb, post_code, addr_info, addr_deta, tel__numb, phon_numb, mail_addr, fpas_ques, 
     job__code, appl_days, modi_days, out__days, true_days, mail_chek, bloc_code, ctl1_code, cspoints, VipType, VipStart, VipDays, JoinDate)
VALUES 
    ('${username}', '${username}', '${username}', '1111111111111', NULL, NULL, NULL, NULL, NULL, '${email}', NULL, 
     NULL, NULL, NULL, NULL, NULL, 0, 0, 0, NULL, NULL, NULL, NULL, NULL);`

    const result = await sql.query(formQuery);

    res.send("Account registered successfully!");
  } catch (err) {
    console.log("err: ",err)
    res.status(500).send("Internal Server Error");
  } finally {
    sql.close(); // Close the database connection
  }
});

app.get("/ranking", async (req, res) => {
  try {
    await sql.connect(dbConfig);

    const formQuery = `SELECT TOP 100 *
FROM MuOnline.dbo.Character
ORDER BY RESETS DESC, cLevel DESC;`

    const result = await sql.query(formQuery);

    res.send(result);
  } catch (err) {
    console.log("err: ",err)
    res.status(500).send("Internal Server Error");
  } finally {
    sql.close(); // Close the database connection
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
