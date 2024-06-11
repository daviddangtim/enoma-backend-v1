import {v2 as cloudinary} from "cloudinary";
import dotenv from "dotenv";
dotenv.config();
6
cloudinary.config({
    cloud_name : "dn9awm7ry",
    api_key : 916958164963943,
    api_secret : "ZijamcySkMklz6EXCliUHcIavZI"
});

export default cloudinary;
