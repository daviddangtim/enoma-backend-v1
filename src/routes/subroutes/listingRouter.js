import express from "express"
const listingRouter = express.Router();
import protect from "../../middleware/routeProtection.js";
import {
    createNewListing, deleteAllListings,
    displayAllListings, displayAllListingsForASingleUserWithId, displayAllListingsForASingleUserWithoutId,
    displaySingleListing, updateListing
} from "../../controllers/products/listingController.js";
import upload from "../../middleware/multer.js";
import {adminOnly, userOnly} from "../../middleware/roleBasedAccess.js";


// create a new listing
listingRouter.post("/create", userOnly,upload.single('img'), createNewListing );
//  displays a single listing on a details page
listingRouter.get("/display-details/:id",userOnly, displaySingleListing)
// Displays all listings and allows filtering
listingRouter.get("/display",userOnly, displayAllListings)
// displays all the listings, self-explanatory
listingRouter.get("/display-all-user",userOnly,displayAllListingsForASingleUserWithoutId)
// displays all listings for a single user
listingRouter.get("/display-user/:id",userOnly,displayAllListingsForASingleUserWithId)
// updates a listing
listingRouter.patch("/update-single/:id",userOnly,updateListing)


// Admin Routes
listingRouter.delete("/deleteall",adminOnly,deleteAllListings)
export default listingRouter;