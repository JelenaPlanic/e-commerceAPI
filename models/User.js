const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema({
    name:
    {
        type:String,
        required:[true, `Please provide name`],
        minLength:3,
        maxLength:50
    },
    email:
    {
        type:String,
        required:[true, `Please provide email`],
        validate:
        { 
            validator: validator.isEmail,
            message: `Please provide valid email`
        },
        unique:true
    },
    password:
    {
        type:String,
        required:[true, `Please provide password`],
        minLength:3
    },
    role:
    {
        type:String,
        enum:["admin", "user"],
        default: "user"
    }
});

UserSchema.pre('save', async function(next)
{
    console.log(`Pre save hook is called!`);
    console.log(this.modifiedPaths());
    if(!this.isModified('password')) return;

    const SALT = 10;
    this.password = await bcrypt.hash(this.password, SALT);
    next();
})

UserSchema.methods.comparePassword = async function(candidatePassword)
{
    const isMatch = await bcrypt.compare(candidatePassword, this.password);
    return isMatch;
}

module.exports = mongoose.model("User", UserSchema);