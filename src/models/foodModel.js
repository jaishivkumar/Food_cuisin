const mongoose = require('mongoose');

 const foodSchema = new mongoose.Schema({
  name: { type: String, required: true },
  ingredients: [{ type: String }],
  prep_time: { type: Number },
  cook_time: { type: Number },
  region: { type: String },
  course: { type: String },
  diet: { type: String },
  flavor_profile:{ type: String },
  state:  { type: String },
  password: {type: String}
});



module.exports = mongoose.model('Food', foodSchema);
