const { StatusCodes } = require("http-status-codes");
const User = require("../models/User");
const customError = require("../errors");
const {checkPermissions, attachCookiesToResponse, createTokenUser} = require("../utils");

const getAllUsers = async(req, res) =>
{
    //console.log(req.user);
    const users = await User.find({role:"user"}).select('-password');
    res.status(StatusCodes.OK).json({count: users.length, users});

}

const getSingleUser = async(req, res) =>
{
    const {id:userId} = req.params;
    const user = await User.findOne({_id:userId}).select("-password");

    if(!user)
    {
        throw new customError.NotFoundError(`No item with id: ${userId}`);
    }
    checkPermissions(req.user, user._id);
    res.status(StatusCodes.OK).json({user});
}

const showCurrentUser = async(req, res) =>
{
    res.status(StatusCodes.OK).json({currentUser: req.user});
}

const updateUser= async(req, res) =>
{
    const {name, email} = req.body;

    if(!name || !email)
    {
        throw new customError.BadRequestError("Please provide all values!");
    }
    const user = await User.findOne({_id:req.user.userId});
    user.name = name;
    user.email = email;
    await user.save();

    const userToken = createTokenUser(user);
    attachCookiesToResponse({res,user:userToken });

    res.status(StatusCodes.OK).json({user:userToken});

}

const updateUserPassword = async(req, res) =>
{
    const {oldPassword, newPassword} = req.body;
    if(!oldPassword || !newPassword)
    {
        throw new customError.BadRequestError('Please provide all values!');
    }

    const user = await User.findOne({_id:req.user.userId});
    const isValidPassword = await user.comparePassword(oldPassword);
    if(!isValidPassword)
    {
        throw new customError.UnathenticatedError('Invalid credentials!');
    }

    user.password = newPassword;
    await user.save();

    res.status(StatusCodes.OK).json({msg:'Success! Password updated!'});
}

module.exports = 
{
    getAllUsers, getSingleUser, showCurrentUser, updateUser, updateUserPassword
}