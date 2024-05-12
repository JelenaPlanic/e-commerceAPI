const express = require("express");
const router = express.Router();
const authenticateUser = require("../middlewares/authenticateUser");
const authorizePermission = require("../middlewares/authorizePermission");
const {
    createProduct, getSingleProduct, getAllProducts, updateProduct, deleteProduct, uploadImage
} = require("../controllers/productController");

const {getSingleProductReviews} = require("../controllers/reviewController");

router.route("/").get(getAllProducts).post(authenticateUser,authorizePermission("admin"), createProduct);

router.route("/uploadImage").post(authenticateUser,authorizePermission("admin"),uploadImage);

router.route("/:id/reviews").get(getSingleProductReviews);

router.route("/:id").get(getSingleProduct).patch(authenticateUser,authorizePermission("admin"), updateProduct)
.delete(authenticateUser, authorizePermission("admin"),deleteProduct);


module.exports = router;