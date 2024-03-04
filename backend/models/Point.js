// models/Point.js
const mongoose = require("mongoose");

const PointSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
  },
  x: {
    type: Number,
    required: true,
  },
  y: {
    type: Number,
    required: true,
  },
  label: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Point", PointSchema);
