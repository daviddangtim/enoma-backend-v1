import express from "express"
const listingRouter = express.Router();
import protect from "../../middleware/routeProtection.js";
import {
    createNewListing,
    displayAllListings, displayAllListingsForASingleUserWithId, displayAllListingsForASingleUserWithoutId,
    displaySingleListing, updateListingPrivate
} from "../../controllers/products/listingController.js";

// create a new listing
listingRouter.post("/create", protect, createNewListing );
//  displays a single listing on a details page
listingRouter.get("/display-single/:id",protect, displaySingleListing)
// displays all the listings, self-explanatory
listingRouter.get("/display-all",protect,displayAllListingsForASingleUserWithoutId)
// displays all listings for a single user
listingRouter.get("/display-user/:id",protect,displayAllListingsForASingleUserWithId)
// updates a listing
listingRouter.patch("/update-single/:id",protect,updateListingPrivate)
export default listingRouter;