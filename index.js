const express = require("express");
const cors = require("cors");
require("dotenv").config();
const port = process.env.PORT || 5000;
// --------------------------------
const app = express();
app.use(cors());
app.use(express.json());
// --------------------------------

async function run() {}

run().catch(console.dir);

// --------------------------------

app.get("/", (req, res) => {
  res.send("Tourism server is running!");
});

app.listen(port, () => {
  console.log("Server running on port", port);
});
