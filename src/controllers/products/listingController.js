import Listing from "../../models/listing.js";

// This function creates a new listing, simple enough
export const createNewListing = async (req,res,next) =>{
   try {
       // This part is gotten from the payload of the jwt, so the user that is logged in as identified as the owner of the listing
       const owner = req.user.id;
     //   The data used to create the document
     const {title, description, size, location,price,isForSale, categories} = req.body;
       let {img} = req.body;

       const newListing = await Listing({
           owner,
           title,
           description,
           size,
           location,
           price,
           isForSale,
           categories,
           img
       })
       // Save the listing and flash an error if not saved
       const listing = await newListing.save()
       if (listing){
           res.status(201).json({Message:"Listing created successfully", listing})
       } else if(!listing){
           res.status(400).json({Message: "Listing was unable to be saved"})
           throw new Error
       }
   } catch (e){
       res.status(500).send("Internal Server Error")
       console.log(`Error encountered in createNewListing ${e}`)
       throw new Error

   }
}

// This function displays a single listing on a details page, and also lets you create cards with the data
export const displaySingleListing = async (req, res, next) =>{
    try{
        const listing = await Listing.findById(req.params.id).populate('owner')
        const {password, ...others} = listing._doc;
        if(!listing){
            res.status(404).json({Message: "This listing was either deleted recently or does not exist"})
        } else if(listing){
            res.status(200).json({Message:"Displaying Single Listing successfully", listing})
        }
    } catch (e){
        res.status(500).send("Internal Server Error")
        console.log(`Error encountered in displaySingleListing  ${e}`)
        throw new Error
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
        throw new Error
    }
}

// This function displays all the listings, self-explanatory
export const displayAllListings = async (req,res,next) => {
    const queryNew = req.query.new;
    const queryCategory = req.query.category;
    try{
        let listings;
        if(queryNew){
            listings =await Listing.find().populate("owner").sort({createdAt:-1}).limit(5);
            const {password, ...others} =listings.owner._doc;

        } else if(queryCategory){
            listings = await Listing.find({categories:{
                    $in: [queryCategory],
                }}).populate("owner");
            const {password, ...others} = listings.owner._doc;
            res.status(200).send(others)

        } else{
            listings = await Listing.find();
        }
    } catch (e) {
        res.status(500).json({Message:"Internal Server Error"})
        console.log(`There was an error in displayAllListings`)
        throw new Error
    }
}
//  This function displays all listings for a single user
export const displayAllListingsForASingleUserWithId = async (req,res,next) => {
    try{
        const listing = await Listing.findById(req.params.id).populate('owner');
        const {password, ...others} = listing._doc;
        if (!listing){
            res.status(204).json({Message: "There are no posts currently"})
            //   Makes sure user who is signed in is not the owner of the listings
        } else if(listing){
            res.status(200).json({Message:"Listings Found", listing})
        }
    } catch (e) {
        res.status(500).json({Message:"Internal Server Error"})
        console.log(`An error was encountered in displayAllListingsForASingleUser ${e} `)
        throw new Error
    }
}

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
        throw new Error
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
        throw new Error
    }
}