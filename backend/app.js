const express = require("express");
const sql = require("mssql");
var cors = require("cors");
require("dotenv").config();
const { sanitizeInput, validateEmail } = require('./helpers');

const dbConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_NAME, // Update this if the database is on a different server
  database: process.env.DB_DEFAULT_NAME,
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
app.options("*", cors());

const port = 8250;

app.get("/health", async (req, res) => {
  res.send("It is ok!");
});

app.post("/register", async (req, res) => {
  try {
    await sql.connect(dbConfig);
    let { username, password, email } = req.body;
    username = sanitizeInput(username, { maxLength: 20, allowedChars: /^[a-zA-Z0-9_]+$/ });
    password = sanitizeInput(password, { maxLength: 50 });
    email = email.trim();
    // add more sanitize

    if (!validateEmail(email, 100)) {
      return res.status(400).json({ error: 'Invalid email address' });
    }

    const emailOrUsernameQueryForm = `SELECT * FROM MuOnline.dbo.MEMB_INFO WHERE mail_addr = '${email}' OR memb___id = '${username}' `;
    const result = await sql.query(emailOrUsernameQueryForm);

    if (result?.recordset?.[0] !== undefined) {
      return res.status(403).send("Email or username already exist!");
    }

    const formQuery = `INSERT INTO MuOnline.dbo.MEMB_INFO 
    (memb___id, memb__pwd, memb_name, sno__numb, post_code, addr_info, addr_deta, tel__numb, phon_numb, mail_addr, fpas_ques, 
     job__code, appl_days, modi_days, out__days, true_days, mail_chek, bloc_code, ctl1_code, cspoints, VipType, VipStart, VipDays, JoinDate)
VALUES 
    ('${username}', '${password}', '${username}', '1111111111111', NULL, NULL, NULL, NULL, NULL, '${email}', NULL, 
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

app.post("/reset", async (req, res) => {
  try {
    await sql.connect(dbConfig);
    let { username, nickname, password } = req.body;
    username = sanitizeInput(username, {
      maxLength: 20,
      allowedChars: /^[a-zA-Z0-9_]+$/,
    }); // Allow alphanumeric + underscore
    nickname = sanitizeInput(nickname, {
      maxLength: 20,
      allowedChars: /^[a-zA-Z0-9_]+$/,
    }); // Same for nickname
    password = sanitizeInput(password, { maxLength: 50 }); // Passwords can have more flexibility, only limit length
    // add more sanitize

    console.log("Reset - REQ BODY: ", req.body);

    const usernameAndPasswordQuery = `SELECT * FROM MuOnline.dbo.MEMB_INFO WHERE memb___id = '${username}' AND memb__pwd = '${password}'`;
    const result = await sql.query(usernameAndPasswordQuery);

    if (
      result?.recordset?.[0] === undefined ||
      result?.recordset?.[0] === null
    ) {
      return res.status(403).send("User does not exist - Wrong password?");
    }

    //Check for level
    const getLevelQuery = `SELECT * FROM MuOnline.dbo.Character WHERE AccountID = '${username}'`;
    const userLvL = await sql.query(getLevelQuery);

    if (userLvL !== 400) {
      return res.status(401).send("Character not level 400!");
    }

    // Update the existing record by incrementing RESETS and setting cLevel to 1
    const updateQuery = `
  UPDATE MuOnline.dbo.Character 
  SET RESETS = ISNULL(RESETS, 0) + 1, cLevel = 1
  WHERE AccountID = '${username}' AND Name = '${nickname}'
`;

    await sql.query(updateQuery);
    return res
      .status(200)
      .send("User found. RESETS incremented, cLevel set to 1.");
  } catch (err) {
    console.log("err: ", err);
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
ORDER BY RESETS DESC, cLevel DESC;`;

    const result = await sql.query(formQuery);

    const normalizeResult = result?.recordset.map((row) => {
      return ({ cLevel, Class, Experience, Reset, Name } = row);
    });

    res.setHeader("Content-Type", "application/json");
    return res.end(JSON.stringify({ data: normalizeResult }));
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
