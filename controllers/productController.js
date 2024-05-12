const Product = require("../models/Product");
const {StatusCodes} = require("http-status-codes");
const customError = require("../errors");
const path  = require("path");

const createProduct = async(req, res) =>
{
    req.body.user = req.user.userId;
    const product = await Product.create(req.body);
    res.status(StatusCodes.CREATED).json({product});
}

const getSingleProduct = async(req, res) =>
{
   const {id:productId} = req.params;
   const product = await Product.findOne({_id:productId}).populate("reviews").populate({path:"user", select:"name email"});
   if(!product)
   {
        throw new customError.NotFoundError(`Product with this id ${productId} does not exist!`);
   }

   res.status(StatusCodes.OK).json({product});

}

const getAllProducts = async(req, res) =>
{
     const products = await Product.find({});
     res.status(StatusCodes.OK).json({count:products.length, products});
}

const updateProduct = async(req, res) =>
{
    const {id:productId} = req.params;
    const product = await Product.findOneAndUpdate(
        {_id:productId},
        req.body,
        {new:true, runValidators:true}
    );
    if(!product)
    {
        throw new customError.NotFoundError(`No product with id ${productId}`);
    }
    res.status(StatusCodes.OK).json({product});

}

const deleteProduct = async(req, res) =>
{
    const {id:productId} = req.params;
    const product = await Product.findOne({_id:productId});
    if(!product)
    {
        throw new customError.NotFoundError(`Product with this id ${productId} does not exist!`);
    }
    await product.deleteOne();
    res.status(StatusCodes.OK).json({msg: " Success! Product removed!"});
}

const uploadImage = async(req, res) =>
{
    if(!req.files)
    {
        throw new customError.BadRequestError("No file uploaded!");
    }
    const productImage = req.files.image;
    if(!productImage.mimetype.startsWith("image"))
    {
        throw new customError.BadRequestError('Please upload image!');
    }
    const maxSize = 1024 * 1024;
    if(productImage.size > maxSize)
    {
        throw new customError.BadRequestError("Please provide image smaller than 1 MB!");
    }

    const pathImage = path.join(__dirname, "../public/uploads/", `${productImage.name}`);
    await productImage.mv(pathImage);
    res.status(StatusCodes.OK).json({image:`/uploads/${productImage.name}`});
}


module.exports = 
{
    createProduct, getSingleProduct, getAllProducts, updateProduct, deleteProduct, uploadImage
}