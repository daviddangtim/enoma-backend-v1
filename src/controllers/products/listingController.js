import Listing from "../../models/listing.js";
import cloudinary from "../../middleware/cloudinary.js";
import dotenv from "dotenv";
import upload from "../../middleware/multer.js";

dotenv.config();

// This function creates a new listing, simple enough
export const createNewListing = async (req, res, next) => {
        try {
            // The data used to create the document
            const { title, description, size, location, price, isForSale, category, img } = req.body;

            let image = await cloudinary.uploader.upload(req.file.path, (err,result)=>{
                if(err){
                    console.log(err);
                    return res.status(500).json({
                        success: false,
                        message: "Error"
                    })
                }
            });
            console.log( image);
            // Create new listing object
            const newListing = new Listing({
                owner: req.user.id, // This part is gotten from the payload of the jwt, so the user that is logged in is identified as the owner of the listing
                title,
                description,
                size,
                location,
                price,
                isForSale,
                category: req.body.category.toLowerCase(),
                img :  image.secure_url,
                cloudinary_id : image.public_id
            });

            // Save the listing and flash an error if not saved
            const listing = await newListing.save();

            if (listing) {
                res.status(200).json({ message: "Listing created successfully", listing });
            } else {
                res.status(400).json({ message: "Listing was unable to be saved" });
            }
        } catch (e) {
            res.status(500).send("Internal Server Error");
            console.log(e);
            console.log(`Error encountered in createNewListing: ${e}`);
        }
};

// This function displays a single listing on a details page, and also lets you create cards with the data
export const displaySingleListing = async (req, res, next) =>{
    try{
        const listings = await Listing.findById(req.params.id).populate('owner')

        const listingsWithoutPasswords = listings.map(listing => {
            const { password, ...ownerWithoutPassword } = listing.owner.toObject();
            return {
                ...listing.toObject(),
                owner: ownerWithoutPassword
            };
        });
        if(!listings){
           return res.status(404).json({Message: "This listing was either deleted recently or does not exist"})
        }
            res.status(200).json({Message:"Displaying Single Listing successfully", listingsWithoutPasswords})


    } catch (e){
        res.status(500).send("Internal Server Error")
        console.log(`Error encountered in displaySingleListing  ${e}`)

    }
}


// This function displays all the listings, self-explanatory
export const displayAllListingsNonQueriable = async (req, res, next) => {
    try {

        const listings = await Listing.find().populate('owner');

        const listingsWithoutPasswords = listings.map(listing => {
            const { password, ...ownerWithoutPassword } = listing.owner.toObject();
            return {
                ...listing.toObject(),
                owner: ownerWithoutPassword
            };
        });

        !listings ?  res.status(204).json({ Message: "There are no posts currently" }) : res.status(200).json({ Message: "Listings Found", listings: listingsWithoutPasswords });

    } catch (e) {
        res.status(500).json({ Message: "Internal Server Error" });
        console.log(`There was an error in displayAllListings`, e);
    }
};

// This function displays all the listings, self-explanatory
export const displayAllListings = async (req, res, next) => {
    try {

        const listings = await Listing.find({ category: req.params.category.toLowerCase() }).populate('owner');

        const listingsWithoutPasswords = listings.map(listing => {
            const { password, ...ownerWithoutPassword } = listing.owner.toObject();
            return {
                ...listing.toObject(),
                owner: ownerWithoutPassword
            };
        });

        !listings ?  res.status(204).json({ Message: "There are no posts currently" }) : res.status(200).json({ Message: "Listings Found", listings: listingsWithoutPasswords });

    } catch (e) {
        res.status(500).json({ Message: "Internal Server Error" });
        console.log(`There was an error in displayAllListings`, e);
    }
};

// DIsplay a users listings
export const displayAllListingsForASingleUserWithId = async (req, res, next) => {
    try {
        const listings = await Listing.findById(req.params.id).populate('owner');

        if (!listings) {
            return res.status(204).json({ Message: "There are no posts currently" });
        }

        const listingsWithoutPasswords = {};
        (listings || []).forEach(listing => {
            const { password, ...ownerWithoutPassword } = listing.owner.toObject();
            listingsWithoutPasswords[listing.id] = {
                ...listing.toObject(),
                owner: ownerWithoutPassword
            };
        });


        return res.status(200).json({ Message: "Listings Found", listings: listingsWithoutPasswords });

    } catch (e) {
        res.status(500).json({ Message: "Internal Server Error", Error: e.message });
        console.log(`An error was encountered in displayAllListingsForASingleUserWithId: ${e}`);
    }
};



export const displayAllListingsForASingleUserWithoutId = async (req, res, next) => {
    try {
        const listings = await Listing.find({ owner: req.user.id }).populate('owner');
        if (!listings || listings.length === 0) {
            res.status(204).json({ Message: "No Listings Found" });
        } else {
            const listingsWithoutPasswords = listings.map(listing => {
                const { password, ...ownerWithoutPassword } = listing.owner.toObject();
                return {
                    ...listing.toObject(),
                    owner: ownerWithoutPassword
                };
            });

            res.status(200).json({ Message: "Listings Found", listings: listingsWithoutPasswords });
        }
    } catch (e) {
        res.status(500).json({ Message: "Internal Server Error" });
        console.error(e.message);
        console.log(`An error was encountered in displayAllListingsForASingleUser ${e}`);
    }
};

export const updateListing = async (req, res, next) => {
    try {
        const listing = await Listing.findById(req.params.id).populate('owner');

        if (!listing) {
            return res.status(404).json({ Message: "This listing was either deleted recently or does not exist" });
        }

        if (listing.owner._id.toString() !== req.user.id) {
            return res.status(401).json({ Message: "You are not allowed to update this listing" });
        }

        // Handle image deletion and upload
        if (req.file) {
            // Delete the old image if it exists
            if (listing.cloudinary_id) {
                try {
                    await cloudinary.uploader.destroy(listing.cloudinary_id);
                } catch (err) {
                    console.log(err);
                    return res.status(500).json({
                        success: false,
                        message: "Error deleting old image"
                    });
                }
            }

            // Upload the new image to Cloudinary
            try {
                const image = await cloudinary.uploader.upload(req.file.path);
                req.body.img = image.secure_url; // Update the image URL
                req.body.cloudinary_id = image.public_id; // Update the Cloudinary ID
            } catch (err) {
                console.log(err);
                return res.status(500).json({
                    success: false,
                    message: "Error uploading new image"
                });
            }
        }

        // Prepare the updated listing object
        const updatedListing = {
            owner: req.user.id, // This part is gotten from the payload of the JWT, so the user that is logged in is identified as the owner of the listing
            title: req.body.title,
            description: req.body.description,
            size: req.body.size,
            location: req.body.location,
            price: req.body.price,
            isForSale: req.body.isForSale,
            categories: req.body.categories,
            img: req.body.img,
            cloudinary_id: req.body.cloudinary_id
        };

        // Update the listing
        const updatedListingResult = await Listing.findByIdAndUpdate(req.params.id, updatedListing, { new: true }).populate('owner');

        // Remove password from the owner object
        const { password, ...ownerWithoutPassword } = updatedListingResult.owner.toObject();
        const listingWithoutPassword = {
            ...updatedListingResult.toObject(),
            owner: ownerWithoutPassword
        };

        res.status(200).json({ Message: "Update Successful", listing: listingWithoutPassword });
    } catch (e) {
        console.error(e);
        res.status(500).send("Internal Server Error");
        console.log(`Error encountered in updateListing: ${e}`);
    }
};

// // Admin Only
export const deleteAllListings = async (req,res) => {
    const listings = await Listing.deleteMany();
    await cloudinary.uploader.destroy(listings.cloudinary_id);
    res.status(200).json({Message:"All listings deleted successfully"});
}