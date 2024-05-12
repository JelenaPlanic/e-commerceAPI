const { StatusCodes } = require("http-status-codes");
const User = require("../models/User");
const customError = require("../errors");
const {createJSONWebToken, attachCookiesToResponse, createTokenUser} = require("../utils");


const register = async(req, res) =>
{
    const {name, email, password} = req.body;

    const emailAlreadyExists = await User.findOne({email});
    if(emailAlreadyExists)
    {
        throw new customError.BadRequestError(`User with this email exists!`);
    }


    const isFirstAccount = await User.countDocuments({}) === 0;
    const role = isFirstAccount? "admin" : "user";

    const user = await User.create({name, email, password, role});
    const userToken = createTokenUser(user);
    

    attachCookiesToResponse({res, user:userToken});

    res.status(StatusCodes.CREATED).json({ user: userToken});

}

const login = async(req, res) =>
{
    const {email, password} = req.body;
    if(!email || !password)
    {
        throw new customError.BadRequestError('Please provide all values');
    }
    const user = await User.findOne({email});
    if(!user)
    {
        throw new customError.NotFoundError(`User with this email does not exist!`);
    }
    const isValidPassword = await user.comparePassword(password);
    if(!isValidPassword)
    {
        throw new customError.UnathenticatedError('Invalid password');
    }
    const userToken = createTokenUser(user);
  
    attachCookiesToResponse({res,user: userToken});
    res.status(StatusCodes.OK).json({user:userToken});
}

const logout = async(req, res) =>
{
    res.cookie("token", "logout", {
        httpOnly: true,
        expires: new Date(Date.now())
    })
    res.status(StatusCodes.OK).json({msg: "You logged out!"});
}

module.exports = {register, login, logout};