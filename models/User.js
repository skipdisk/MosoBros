const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema({
  googleID: String,
  credits: { type: Number, default: 0 },
  images: [
    {
      type: String
    }
  ],
  mosaicImages: [
    {
      type: String
    }
  ]
});

//creates new collection called 'users' if doesn't already exist
mongoose.model("users", userSchema);
