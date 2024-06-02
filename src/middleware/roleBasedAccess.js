import protect from "./routeProtection.js";

const adminOnly =   (req,res,next) =>{
    protect(req, res , ()=>{
        if( req.user.isAdmin) {
            next()
        } else {
            res.status(403).send("Admin Only")
        }
    })
}

const userOnly =   (req,res,next) =>{
    protect(req, res , ()=>{
        if(req.user.id === req.params.id) {
            next()
        } else {
            res.status(403).send("You are not allowed to do that!")
        }
    })
}
export {adminOnly,userOnly};