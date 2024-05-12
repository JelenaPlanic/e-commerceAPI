const CustomErrorAPI = require("./CustomErrorAPI");
const {StatusCodes} = require("http-status-codes");

class UnauthenticatedError extends CustomErrorAPI 
{
    constructor(message){
        super(message);
        this.statusCode = StatusCodes.UNAUTHORIZED;
    }
}

module.exports = UnauthenticatedError;