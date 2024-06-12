import protect from "./routeProtection.js";

const adminOnly =   (req,res,next) =>{
    protect(req, res , ()=>{
        if( req.user.isAdmin || req.user.role === "Admin") {
            next();
        } else {
            res.status(403).send("Admin Only");
        }
    })
}

const userOnly = (req, res, next) => {
    protect(req, res, () => {
        const roles = ["provider", "user", "client"];
        if (req.user.id === req.params.id || roles.includes(req.user.role.toLowerCase())) {
            next();
        } else {
            res.status(403).send("You are not allowed to do that!");
        }
    });
};

export {adminOnly,userOnly};