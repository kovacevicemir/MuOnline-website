const express = require("express");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const sql = require("mssql");
var cors = require("cors");
require("dotenv").config();
const { sanitizeInput, validateEmail } = require("./helpers");

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

// Use Helmet for basic security protections
app.use(helmet());

// Define rate limit: max 100 requests per IP per 15 minutes
const generalRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again after 15 minutes",
});

// Specific rate limiter for sensitive endpoints (e.g., /register)
const registerRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // limit each IP to 10 requests per windowMs for /register
  message: "Too many registration attempts, please try again later.",
});

// Apply general rate limiter to all routes
app.use(generalRateLimiter);

const port = 8250;

app.get("/health", registerRateLimiter, async (req, res) => {
  res.send("It is ok!");
});

app.post("/register", registerRateLimiter, async (req, res) => {
  try {
    await sql.connect(dbConfig);
    let { username, password, email } = req.body;
    username = sanitizeInput(username, {
      maxLength: 20,
      allowedChars: /^[a-zA-Z0-9_]+$/,
    });
    password = sanitizeInput(password, { maxLength: 50 });
    email = email.trim();
    // add more sanitize

    if (!validateEmail(email, 100)) {
      return res.status(400).json({ error: "Invalid email address" });
    }

    const emailOrUsernameQueryForm = `SELECT * FROM MuOnline.dbo.MEMB_INFO WHERE mail_addr = '${email}' OR memb___id = '${username}' `;
    const result = await sql.query(emailOrUsernameQueryForm);

    if (result?.recordset?.[0] !== undefined) {
      return res.status(403).send("Email or username already exist!");
    }

    const formQuery = `INSERT INTO MuOnline.dbo.MEMB_INFO 
    (memb___id, memb__pwd, memb_name, sno__numb, post_code, addr_info, addr_deta, tel__numb, phon_numb, mail_addr, fpas_ques, 
     job__code, appl_days, modi_days, out__days, true_days, mail_chek, bloc_code, ctl1_code)
VALUES 
    ('${username}', '${password}', '${username}', '1111111111111', NULL, NULL, NULL, NULL, NULL, '${email}', NULL, 
     NULL, NULL, NULL, NULL, NULL, 0, 0, 0);`;

    await sql.query(formQuery);

    return res.status(200).send("Account registered successfully!");
  } catch (err) {
    console.log("err: ", err);
    res.status(500).send("Internal Server Error");
  } finally {
    sql.close(); // Close the database connection
  }
});

app.get("/online", async (req, res) => {
  try {
    await sql.connect(dbConfig);
    const countOnlineUsersQuery = `SELECT COUNT(ConnectStat) AS OnlineCount
FROM MuOnline.dbo.MEMB_STAT AS Online
WHERE ConnectStat = 1;`;
    const result = await sql.query(countOnlineUsersQuery);

    return res.end(JSON.stringify({ data: result.recordset[0] }));
  } catch (error) {
    console.log("error: ", error);
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
    const lvlQueryRes = await sql.query(getLevelQuery);

    if (lvlQueryRes?.recordset?.[0].cLevel !== 400) {
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

    const formQuery = `
  SELECT TOP 22 cLevel, Class, Experience, Name
  FROM MuOnline.dbo.Character
  ORDER BY cLevel DESC;
`;

    const result = await sql.query(formQuery);

    const normalizeResult = result?.recordset
      .map((row) => {
        const { cLevel, Class, Experience, Name } = row;
        return { cLevel, Class, Experience, Name };
      })
      .filter((char) => char.Name !== "Admin" && char.Name !== "admin2");

    res.setHeader("Content-Type", "application/json");
    return res.end(JSON.stringify({ data: normalizeResult }));
  } catch (err) {
    console.log("err: ", err);
    res.status(500).send("Internal Server Error");
  } finally {
    sql.close(); // Close the database connection
  }
});

const onlineWCoinsRewardQuery = `
  UPDATE dbo.CashShopData
  SET WCoinP = WCoinP + 1
  FROM dbo.CashShopData igsp
  INNER JOIN dbo.MEMB_STAT ms ON igsp.AccountID = ms.memb___id
  WHERE ms.ConnectStat = 1;
`;

const updateWCoinC = async () => {
  console.log("Updating WCoinC...");

  let connection;
  try {
    // Establish connection using the connection pool
    connection = await sql.connect(dbConfig);

    // Execute the query
    const result = await connection.query(onlineWCoinsRewardQuery);
    
    console.log("WCoinC updated for active users");
  } catch (err) {
    console.error("Error executing query:", err);
  } finally {
    // Always release the connection back to the pool
    if (connection) {
      connection.close(); // Close the connection and release it to the pool
    }
  }
};

const updateMasterLevel = async () => {
  console.log("Updating master...");

  let connection;
  try {
    // Establish connection using the connection pool
    connection = await sql.connect(dbConfig);

    // Your update query
    const updateQuery = `
      UPDATE mst
      SET mst.MasterLevel = 1, mst.MasterPoint = 1
      FROM dbo.MasterSkillTree AS mst
      INNER JOIN dbo.Character AS c ON mst.Name = c.Name
      WHERE mst.MasterLevel = 0
        AND c.cLevel = 400;
    `;

    // Execute the query
    await connection.query(updateQuery);
    await connection.query(onlineWCoinsRewardQuery);

    console.log("Master level updated successfully.");
  } catch (err) {
    console.error("Error updating master level:", err);
  } finally {
    // Always release the connection back to the pool
    if (connection) {
      connection.close(); // This closes the connection and releases it back to the pool
      clearInterval(updateMasterLevel);
    }
  }
};

const minute = 60 * 1000; //miliseconds
// Execute the function every 1 minute (60000 milliseconds)

const updateMasterLevelInterval = setInterval(updateMasterLevel, 1 * minute);
// const updateWCoinCInterval = setInterval(updateWCoinC, 15 * minute + 1000 );

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
