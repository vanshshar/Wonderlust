const mongoose = require("mongoose");
const review = require("./review");
const { ref } = require("joi");
const Schema = mongoose.Schema;
const Review = require("./review.js");

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
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review",
        },
    ],
});


listingSchema.post("findOneAndDelete" , async(listing) => {
    if(listing) {
        await Review.deleteMany({_id: {$in: listing.reviews}});
    }
});


const Listing = mongoose.model("Listing" , listingSchema);
module.exports = Listing;