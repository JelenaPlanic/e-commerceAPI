const jwt = require("jsonwebtoken");

// create token:
const createJSONWebToken = ({payload}) =>
{
    const token = jwt.sign(payload, process.env.JWT_SECRET, {expiresIn:process.env.JWT_LIFETIME});
    return token;
}

// deal with cookie
const attachCookiesToResponse = ({res, user}) =>
{
    const token = createJSONWebToken({payload:user});

    const oneDay = 1000 * 60 * 60 * 24;
    res.cookie("token", token, 
    {
        httpOnly:true,
        expires: new Date(Date.now() + oneDay),
        secure: process.env.NODE_ENV === "production",
        signed:true
    });
}

const isTokenValid = ({token}) =>
{
    return jwt.verify(token, process.env.JWT_SECRET);
}





module.exports = {createJSONWebToken, attachCookiesToResponse, isTokenValid};