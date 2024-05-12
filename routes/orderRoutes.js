const express = require("express");
const router = express.Router();
const authenticateUser = require("../middlewares/authenticateUser");
const authorizePermission = require("../middlewares/authorizePermission");
const {getAllOrders, getSingleOrder, getCurrentUserOrders, createOrder, updateOrder} = require("../controllers/orderControllers");


// /api/v1/orders

router.route("/").post(authenticateUser, createOrder).get(authenticateUser, authorizePermission("admin"), getAllOrders );
router.route("/showAllMyOrders").get(authenticateUser, getCurrentUserOrders);
router.route("/:id").get(authenticateUser, getSingleOrder).patch(authenticateUser, updateOrder);







module.exports = router;