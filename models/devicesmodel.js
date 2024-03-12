const mongoose = require('mongoose');

const DevicesSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Devices must be belong to user'],
    },
    name: String,
    model: String,
    brand: String,
  },
  { timestamps: true }
);


module.exports = mongoose.model('Devices', DevicesSchema);