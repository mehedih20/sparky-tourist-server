const express = require("express");
const cors = require("cors");
const { MongoClient } = require("mongodb");
const ObjectId = require("mongodb").ObjectId;
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
    const allBookings = database.collection("allBookings");

    // Get all tours
    app.get("/tours", async (req, res) => {
      const result = await toursCollection.find({}).toArray();
      res.send(result);
    });

    // Add new tour
    app.post("/tours", async (req, res) => {
      const tour = req.body;
      const result = await toursCollection.insertOne(tour);
      res.send(result);
    });

    // Get single tour
    app.get("/tours/:id", async (req, res) => {
      const query = { _id: ObjectId(req.params.id) };
      const result = await toursCollection.findOne(query);
      res.send(result);
    });

    // Add Booking
    app.post("/bookings", async (req, res) => {
      const data = req.body;
      const result = await allBookings.insertOne(data);
      res.send(result);
    });

    // Get All Bookings
    app.get("/bookings", async (req, res) => {
      const result = await allBookings.find({}).toArray();
      res.send(result);
    });

    // Get My Bookings
    app.get("/bookings/:email", async (req, res) => {
      const userEmail = req.params.email;
      const filter = { email: userEmail };

      const result = await allBookings.find(filter).toArray();
      res.send(result);
    });

    // Update Booking Status
    app.put("/bookings/:id", async (req, res) => {
      const bookingId = req.params.id;
      const filter = { _id: ObjectId(bookingId) };
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          status: "approved",
        },
      };
      const result = await allBookings.updateOne(filter, updateDoc, options);
      res.send(result);
    });

    // Delete Booking
    app.delete("/bookings/:id", async (req, res) => {
      const bookingId = req.params.id;
      const filter = { _id: ObjectId(bookingId) };
      const result = await allBookings.deleteOne(filter);
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
