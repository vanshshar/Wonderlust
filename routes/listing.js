const express = require("express");
const router = express.Router();
const wrapAsync  = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { listingSchema , reviewSchema } = require("../schema.js");
const Listing =  require("../models/listing.js");

const validateListing = (req , res , next) => {
    let { error } = listingSchema.validate(req.body);
    console.log(error);
    if(error) {
        let errMsg = error.details.map((el) => el.message).join(", ");
        throw new ExpressError(400 , errMsg);
    }else {
        next();
    }
}


//index route
router.get("/" , wrapAsync(async(req , res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs" , {allListings});
}));


//new route

router.get("/new" , (req , res) => {
    res.render("listings/new.ejs");
});

//Show route
router.get("/:id" , wrapAsync(async(req , res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id).populate("reviews");
    res.render("listings/show.ejs" , {listing})
}));

//Create route

router.post("/" , wrapAsync(async (req , res , next) => {
    const newListings = new Listing(req.body.listing);
    await newListings.save();
    res.redirect("/listings");
    })
);

//Edit route

router.get("/:id/edit" , wrapAsync(async(req , res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs" , {listing});
}));

//Update route

router.put("/:id", validateListing , wrapAsync(async(req , res) => {
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id , { ...req.body.listing });
    res.redirect(`/listings/${id}`);
}));

//Delete route
router.delete("/:id" , wrapAsync(async (req , res) => {
    let {id} = req.params;
    let deletedlisting = await Listing.findByIdAndDelete(id);
    console.log(deletedlisting);
    res.redirect("/listings");
}));

module.exports = router;