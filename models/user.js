const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose"); // Correct package name

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true // Add unique constraint for email
    }
});

userSchema.plugin(passportLocalMongoose); // Use userSchema.plugin() not User.plugin()

module.exports = mongoose.model('User', userSchema);
