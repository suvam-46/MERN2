const permitTo = (...roles) => {
    return (req,res, next)=> {
        const userRole = req.user.role;
        if(!roles.includes(userRole)){
            res.status(403).json({
                message : "You dont have permission for this.Forbidden",
            });
        } else {
            next();
        }
    }
}
module.exports = permitTo;