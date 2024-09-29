const Listing = require("../models/listing");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

console.log(mapToken);



module.exports.index = async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
  };

  module.exports.renderNewForm = async (req, res) => {
    return res.render("listings/new");
  };

  module.exports.showListings = async (req, res) => {
    let { id } = req.params;
    // Populate reviews with their authors and listing owner
    const listing = await Listing.findById(id)
      .populate({
        path: "reviews",
        populate: {
          path: "author", // Ensure this path is correctly set in Review schema
          model: "User",  // Explicitly specify the model to populate
        },
      })
      .populate("owner").exec();

    if (!listing) {
      req.flash("error", "Listing you requested does not exist");
      return res.redirect("/listings");
    }

    res.render("listings/show.ejs", { listing });
  };

  module.exports.createListing = async (req, res, next) => {
    let response = await geocodingClient.forwardGeocode({
      query: req.body.listing.location,
      limit: 1,
    }).send();

  
    // Check if features and geometry exist in the response
    if (!response.body.features.length) {
      req.flash("error", "Location not found. Please enter a valid location.");
      return res.redirect("/listings/new");
    }
  
    let geometry = response.body.features[0].geometry;
    let url = req.file.path;
    let filename = req.file.filename;
    console.log(response.body.features[0].geometry);
  
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = { url, filename };
    newListing.geometry = response.body.features[0].geometry; // Save geolocation
  
    let savedListing = await newListing.save();
    console.log(response.body.features[0].geometry);

    console.log(savedListing);
    req.flash("success", "New Listing Created!");
    res.redirect("/listings");
  };
  
  

  module.exports.renderEditForm = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
      req.flash("error", "Listing you requested for does not exit");
      res.redirect("/listings");
    }

    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_250");

    res.render("listings/edit.ejs", { listing, originalImageUrl });
  };

  module.exports.updateListing = async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

    if(typeof req.file !== "undefined") {

    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = {url, filename};
    await listing.save();
    }

    req.flash("success", "Listing Updated1");
    res.redirect(`/listings/${id}`);
  };

  module.exports.destroyListing = async (req, res) => {
    let { id } = req.params;
    let deletedlisting = await Listing.findByIdAndDelete(id);
    req.flash("success", "listing Deleted");
    res.redirect("/listings");
  };