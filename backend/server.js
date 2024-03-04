// server.js
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const Point = require("./models/Point");

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Connect to MongoDB
mongoose
  .connect(
    "mongodb+srv://abhishekkolhatkar2000:Abhishek@project.amave1n.mongodb.net/?retryWrites=true&w=majority"
  )
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

// Routes
app.post("/api/points", async (req, res) => {
  try {
    const { id, x, y, label } = req.body;
    const newPoint = new Point({ id, x, y, label });
    await newPoint.save();
    res.json(newPoint);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

app.get("/api/points", async (req, res) => {
  try {
    const points = await Point.find();
    res.json(points);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

app.put("/api/points/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { x, y, label } = req.body;
    let point = await Point.findById(id);
    if (!point) return res.status(404).json({ msg: "Point not found" });

    point.x = x;
    point.y = y;
    point.label = label;

    await point.save();
    res.json(point);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

app.delete("/api/points/:id", async (req, res) => {
  try {
    const { id } = req.params;
    let point = await Point.findById(id);
    if (!point) return res.status(404).json({ msg: "Point not found" });

    await Point.deleteOne({ _id: id });
    res.json({ msg: "Point removed" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
