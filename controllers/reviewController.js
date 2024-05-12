const Review = require("../models/Review");
const Product = require("../models/Product");
const { StatusCodes } = require("http-status-codes");
const customError = require("../errors");
const checkPermissions = require("../utils/checkPermisisons");



const createReview  = async(req, res) =>
{
     const {product:productId} = req.body;
     const isValidProduct = await Product.findOne({_id:productId});
     if(!isValidProduct)
     {
      throw new customError.NotFoundError(`No product with id ${productId}`);
     }

     const alreadySubmitted = await Review.findOne({user:req.user.userId, product: productId});
     if(alreadySubmitted)
      {
       throw new customError.BadRequestError("Already submitted review for this product!");
      }


     req.body.user = req.user.userId;
     const review = await Review.create(req.body);

     res.status(StatusCodes.CREATED).json({review});

}

const getSingleReview  = async(req, res) =>
{
   const {id:reviewId} = req.params;
   const review = await Review.findOne({_id:reviewId});
   if(!review)
   {
      throw new customError.NotFoundError(`No review with id: ${reviewId}`);
   }
   res.status(StatusCodes.OK).json({review});
}

const getAllReviews  = async(req, res) =>
{
    const reviews = await Review.find({});
    res.status(StatusCodes.OK).json({count:reviews.length, reviews});
}

const updateReview  = async(req, res) =>
{
    const {id:reviewId} = req.params;
    const {rating, title, comment} = req.body;
    const review = await Review.findOne({_id:reviewId});
    if(!review)
    {
       throw new customError.NotFoundError(`No review with id: ${reviewId}`);
    }
    checkPermissions(req.user, review.user);
    review.title = title;
    review.comment = comment;
    review.rating = rating;
    await review.save();

    res.status(StatusCodes.OK).json({review});

}

const deleteReview  = async(req, res) =>
{
     const {id:reviewId} = req.params;
     const review = await Review.findOne({_id:reviewId});
     if(!review){
      throw new customError.NotFoundError(`No review with id: ${reviewId}`);
     }

     checkPermissions(req.user, review.user);
     await review.deleteOne();
     res.status(StatusCodes.OK).json({msg: "SUCCESS, Review removed!"});
}

const getSingleProductReviews = async(req, res) =>
{
   const {id:productId} = req.params;
   const reviews = await Review.find({product:productId});
   res.status(StatusCodes.OK).json({count:reviews.length, reviews});
}

module.exports = {createReview, getSingleReview, getAllReviews, updateReview, deleteReview, getSingleProductReviews};
  