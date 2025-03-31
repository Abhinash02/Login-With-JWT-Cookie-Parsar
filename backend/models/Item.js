const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: false },  // Optional field
});

module.exports = mongoose.model("Item", itemSchema);
