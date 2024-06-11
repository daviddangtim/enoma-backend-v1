import protect from "./routeProtection.js";

const adminOnly =   (req,res,next) =>{
    protect(req, res , ()=>{
        if( req.user.isAdmin || req.user.role === "admin") {
            next();
        } else {
            res.status(403).send("Admin Only");
        }
    })
}

const userOnly =   (req,res,next) =>{
    protect(req, res , ()=>{
        if(req.user.id === req.params.id || req.user.role === "User") {
            next();
        } else {
            res.status(403).send("You are not allowed to do that!");
        }
    })
}
export {adminOnly,userOnly};