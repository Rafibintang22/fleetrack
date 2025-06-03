const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");

const app = express();
dotenv.config({ path: "./config/.env" });

// folder /uploads dibuat jadi publik
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use(bodyParser.json({ limit: "50mb" }));
app.use(express.json()); //untuk server dapat menerima req body/params/query dari client menjadi format json
app.use(express.urlencoded({ extended: true })); //agar server bisa membaca req dsri client
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    methods: ["POST", "GET", "DELETE", "PUT", "PATCH", "OPTIONS"],
    credentials: true,
    allowedHeaders: ["Content-Type", "authorization"],
    exposedHeaders: ["authorization"],
  })
);

const { router } = require("./routes");
app.use("/", router);

const port = 3001;
app.listen(port, () => {
  console.log(`>> Server is running on http://localhost:${port}`);
});
