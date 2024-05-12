const customError = require("../errors");
const {isTokenValid} = require("../utils");


const authenticateUser = async(req, res, next) =>
{
    const token = req.signedCookies.token;
   // console.log("TOKEN");
    //console.log(token);
    if(!token)
    {
        throw new customError.UnathenticatedError('Authentication failed! No token!');
    }
    try 
    {
        const {name, role, userId} = isTokenValid({token});
        req.user = {name, role, userId};
        next();
    } catch (error) {
        console.log(error);
        throw new customError.UnathenticatedError('Authentication invalid!');
    }
}


module.exports = authenticateUser;