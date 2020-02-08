const mongoose = require('mongoose');
const { Schema } = mongoose;

const ImageSchema = new Schema({
    imageName: {
        type: String,
        default: 'none',
        required: true
    },
    imageData: {
        type: String,
        required: true
    }
});

//creates new collection called 'users' if doesn't already exist
var Image = mongoose.model('Image', ImageSchema);

module.exports = Image;