const customError = require("../errors");

const authorizePermission = (...roles) =>
{
    console.log(roles);
    return (req, res, next) =>
    {
        if(!roles.includes(req.user.role))
        {
            throw new customError.UnauthorizedError('Unauthorized to access this route!');
        }
        next();
    }
    
    
}

module.exports = authorizePermission;