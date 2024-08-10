const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
    title :  {
        type : String,
        required : true,
    },
    description : String,
    image : { 
        type : String,
        default : "https://teja12.kuikr.com/is/a/c/430x200/public/images/apartments/original_img/qgl7vv.gif",
        set : (v) => v==="" ? "https://teja12.kuikr.com/is/a/c/430x200/public/images/apartments/original_img/qgl7vv.gif" : v,
    },
    price : Number,
    location : String,
    country : String,
});

const Listing = mongoose.model("Listing" , listingSchema);
module.exports = Listing;