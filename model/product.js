const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const productSchema = new Schema({
  title: {
    type: String,
  },
  description: {
    type: String,
  },
  price: {
    type: Number,
  },
  category: {
    type: String,
  },
  image: {
    type:String,
    // required:true
  },
},
{timestamps:true}
);


module.exports = mongoose.model("products", productSchema);
