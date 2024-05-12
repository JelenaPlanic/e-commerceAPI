const BadRequestError = require("./BadRequestError");
const NotFoundError = require("./NotFoundError");
const UnathenticatedError = require("./UnathenticatedError");
const UnauthorizedError = require("./UnauthorizedError");
const CustomErrorAPI = require("./CustomErrorAPI");



module.exports = 
{
    BadRequestError,
    NotFoundError,
    UnathenticatedError,
    UnauthorizedError,
    CustomErrorAPI
}