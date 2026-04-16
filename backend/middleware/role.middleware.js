exports.authorize = (...roles) => {
    
    return (req,res,next) => {
        // check if allowed roles include this role

        if(!roles.includes(req.user.role)){
            return res.status(403).json({message: "Access denied"})
        }

        next()
    }
}