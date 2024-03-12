const mongoose = require('mongoose');
// 1- Create Schema
const ServisesSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Servises required'],
      minlength: [3, 'Too short Servises name'],
      maxlength: [32, 'Too long Servises name'],
    },
    slug: {
      type: String,
      lowercase: true,
    },
    image: String,
    phone: String,
    namebuttom: String,
    details: String,
  },
  { timestamps: true }
);

const setImageURL = (doc) => {
  if (doc.image) {
    const imageUrl = `http://91.238.161.181/services/${doc.image}`;
    doc.image = imageUrl;
  }
};
// findOne, findAll and update
ServisesSchema.post('init', (doc) => {
  setImageURL(doc);
});

// create
ServisesSchema.post('save', (doc) => {
  setImageURL(doc);
});

// 2- Create model
const ServisesModel = mongoose.model('Servises', ServisesSchema);

module.exports = ServisesModel;