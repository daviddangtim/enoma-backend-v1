import express from "express"
const listingRouter = express.Router();
import protect from "../../middleware/routeProtection.js";
import {
    createNewListing,
    displayAllListings, displayAllListingsForASingleUserWithId, displayAllListingsForASingleUserWithoutId,
    displaySingleListing, updateListingPrivate
} from "../../controllers/products/listingController.js";
import upload from "../../middleware/multer.js";


// create a new listing
listingRouter.post("/create", protect,upload.single('img'), createNewListing );
//  displays a single listing on a details page
listingRouter.get("/display-single/:id",protect, displaySingleListing)
// Displays all listings and allows filtering
listingRouter.get("/display-single",protect, displayAllListings)
// displays all the listings, self-explanatory
listingRouter.get("/display-all",protect,displayAllListingsForASingleUserWithoutId)
// displays all listings for a single user
listingRouter.get("/display-user/:id",protect,displayAllListingsForASingleUserWithId)
// updates a listing
listingRouter.patch("/update-single/:id",protect,updateListingPrivate)
export default listingRouter;