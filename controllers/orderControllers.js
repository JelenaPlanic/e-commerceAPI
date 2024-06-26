const Order = require("../models/Order");
const Product = require("../models/Product");
const customError = require("../errors");
const {StatusCodes} = require("http-status-codes");
const { checkPermissions } = require("../utils");


    const fakeStripeAPI = async({amount, currency}) =>
    {
        const client_secret = "someRandomValues";
        return {client_secret, amount};
    }

    const createOrder = async(req, res) =>
    {
       const {items:cartItems, tax, shippingFee} = req.body;
       if(!cartItems || cartItems.length < 1)
       {
         throw new customError.BadRequestError("No cart items provided!");
       }
       if(!tax || !shippingFee)
       {
        throw new customError.BadRequestError("Please provide tax and shipping fee!");
       }

       let orderItems =[];
       let subtotal =0;

       for(const item of cartItems)
       {
          const dbProduct = await Product.findOne({_id:item.product});
          if(!dbProduct)
          {
            throw new customError.NotFoundError(`No product with id:${$item.product}`);
          }
          const {name, price, image, _id} = dbProduct;
          const singleOrderItem = 
          {
             name, price, image, product:_id, amount:item.amount
          }
          orderItems = [...orderItems, singleOrderItem];
          subtotal += item.amount * price;
       }
       const total = subtotal + tax + shippingFee;
       const paymentIntent = await fakeStripeAPI(
        {
            amount: total,
            currency:"usd"
        }
       )
       const order = await Order.create(
        {
             tax,
             shippingFee, 
             subtotal, 
             total, 
             orderItems,
             clientSecret:paymentIntent.client_secret, 
             user: req.user.userId
        }
       );
       res.status(StatusCodes.CREATED).json({order, clientSecret:paymentIntent.client_secret});
    }


    const getAllOrders = async(req, res) =>
    {
         const orders = await Order.find({});
         res.status(StatusCodes.OK).json({count:orders.length, orders});
    }

    const getSingleOrder = async(req, res) =>
    {
        const {id:orderId} = req.params;
        const order = await Order.findOne({_id:orderId});
        if(!order)
        {
            throw new customError.NotFoundError(`No order with id: ${orderId}`);
        }
        checkPermissions(req.user, order.user);
        res.status(StatusCodes.OK).json({order});

    }

    const getCurrentUserOrders = async(req, res) =>
    {
        const orders = await Order.find({user:req.user.userId});
        res.status(StatusCodes.OK).json({count:orders.length, orders});
    }
    

    const updateOrder = async(req, res) =>
    {
       const{id:orderId} = req.params;
       const {paymentIntentId} = req.body;
       const order = await Order.findOne({_id:orderId});
       if(!order)
       {
            throw new customError.NotFoundError(`No order with id: ${orderId}`);
       }

       checkPermissions(req.user, order.user);
       order.paymentId = paymentIntentId;
       order.status = "paided";
       await order.save();
       res.status(StatusCodes.OK).json({order});
    }

    module.exports = {getAllOrders, getSingleOrder, getCurrentUserOrders, createOrder, updateOrder};