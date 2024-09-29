const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const {
  loggedIn,
  isLoggedIn,
  isOwner,
  validateListing,
} = require("../middleware.js");

const listingController = require("../controllers/listings.js");
const multer  = require('multer');
const {storage} = require("../cloudConfig.js");
const upload = multer({ storage });



//index and create route
router.route("/")
.get(wrapAsync(listingController.index))
.post(
  isLoggedIn,upload.single('listing[image]'),
  wrapAsync(listingController.createListing)
);

//new route

router.get("/new", isLoggedIn, listingController.renderNewForm);

//show,update and delete
router.route("/:id")
.get(
  wrapAsync(listingController.showListings)
)
.put(
  isLoggedIn,
  isOwner,
  upload.single('listing[image]'),
  wrapAsync(listingController.updateListing)
)
.delete(
  isLoggedIn,
  wrapAsync(listingController.destroyListing)
);



//Edit route

router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.renderEditForm)
);


module.exports = router;
