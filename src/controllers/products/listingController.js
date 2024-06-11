import Listing from "../../models/listing.js";
import cloudinary from "../../middleware/cloudinary.js";
import dotenv from "dotenv";
import upload from "../../middleware/multer.js";

dotenv.config();

// This function creates a new listing, simple enough
export const createNewListing = async (req, res, next) => {
        try {
            // The data used to create the document
            const { title, description, size, location, price, isForSale, categories } = req.body;
            let {image} = await cloudinary.uploader.upload(req.file.path, (err,result)=>{
                if(err){
                    console.log(err);
                    return res.status(500).json({
                        success: false,
                        message: "Error"
                    })
                }
            });
            console.log( image.secure_url,  image.public_id);
            // Create new listing object
            const newListing = new Listing({
                owner: req.user.id, // This part is gotten from the payload of the jwt, so the user that is logged in is identified as the owner of the listing
                title,
                description,
                size,
                location,
                price,
                isForSale,
                categories,
                image :  image.secure_url,
                cloudinary_id : image.public_id
            });

            // Save the listing and flash an error if not saved
            const listing = await newListing.save();

            if (listing) {
                res.status(201).json({ message: "Listing created successfully", listing });
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
        const listing = await Listing.findById(req.params.id).populate('owner')
        const {password, ...others} = listing;
        if(!listing){
            res.status(404).json({Message: "This listing was either deleted recently or does not exist"})
        } else if(listing){
            res.status(200).json({Message:"Displaying Single Listing successfully", others})
        }
    } catch (e){
        res.status(500).send("Internal Server Error")
        console.log(`Error encountered in displaySingleListing  ${e}`)

    }
}

export const getAllListings = async(req,res)=>{
    const queryNew = req.query.new;
    const queryCategory = req.query.category;
    try{
        let listings;
        if(queryNew){
            listings =await Listing.find().sort({createdAt:-1}).limit(5);
        } else if(queryCategory){
            listings = await Listing.find({categories:{
                $in: [queryCategory],
                }});

        } else{
            listings = await Listing.find();
        }
    }catch (e) {
        res.status(500).send(e)

    }
}

// This function displays all the listings, self-explanatory
export const displayAllListings = async (req, res, next) => {
    const queryNew = req.query.new;
    const queryCategory = req.query.category;

    try {
        let listings;

        if (queryNew) {
            listings = await Listing.find().populate("owner").sort({ createdAt: -1 }).limit(5);
        } else if (queryCategory) {
            listings = await Listing.find({ categories: { $in: [queryCategory] } }).populate("owner");
        } else {
            listings = await Listing.find().populate("owner");
        }

        const listingsWithoutPasswords = listings.map(listing => {
            const { password, ...ownerWithoutPassword } = listing.owner.toObject();
            return {
                ...listing.toObject(),
                owner: ownerWithoutPassword
            };
        });

        res.status(200).json(listingsWithoutPasswords);
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

        const listingsWithoutPasswords = listings.map(listing => {
            const { password, ...ownerWithoutPassword } = listing.owner.toObject();
            return {
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



export const displayAllListingsForASingleUserWithoutId = async (req,res,next) => {
    try{
        const listing = await Listing.findById(req.user.id);


        if (!listing){
            res.status(204)
            //   Makes sure user who is signed in is not the owner of the listings
        } else if(listing.owner.toString() !== req.user.id){
            res.status(401).json({Unauthorised: "You are not allowed to view these"})
        } else if(listing){
            res.status(200).json({Message:"Listings Found", listing})
        }
    } catch (e) {
        res.status(500).json({Message:"Internal Server Error"})
        console.log(`An error was encountered in displayAllListingsForASingleUser ${e} `)

    }
}

export const updateListingPrivate = async (req, res, next) => {
    try {
        const listing = await Listing.findByIdAndUpdate(req.params.id, req.body, {new: true})

        if (!listing) {
            res.status(404).json({Message: "This listing was either deleted recently or does not exist"})
        }else if (listing.owner.toString() !== req.user.id) {
            res.status(401).json({Message: "You are not allowed to update this listing"})
        }
        else if (listing) {
            res.status(200).json({Message: "Update Successful", listing})
        }
    } catch (e) {
        res.status(500).send("Internal Server Error")
        console.log(`Error encountered in updateListingPrivate ${e}`)

    }}
