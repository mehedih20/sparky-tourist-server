const express = require("express");
const cors = require("cors");
const { MongoClient } = require("mongodb");
require("dotenv").config();
const port = process.env.PORT || 5000;
// --------------------------------
const app = express();
app.use(cors());
app.use(express.json());
// --------------------------------

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ds1tl.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    await client.connect();
    const database = client.db("SparkyTours");
    const toursCollection = database.collection("tours");

    // Get all tours
    app.get("/tours", async (req, res) => {
      const result = await toursCollection.find({}).toArray();
      res.send(result);
    });
  } finally {
    // await client.close()
  }
}

run().catch(console.dir);

// --------------------------------

app.get("/", (req, res) => {
  res.send("Tourism server is running!");
});

app.listen(port, () => {
  console.log("Server running on port", port);
});
