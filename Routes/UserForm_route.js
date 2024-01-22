const express = require("express");
const router = express();

const { authentication } = require("../middleware/authentication");
const userForm = require("../controller/userForm");



//////////// UserForm All Routes //////////////////

router.route("/products").get(authentication, userForm.products);
router.route("/products/:id").get(authentication,userForm.productId);
router.route("/products/category/:id").get(authentication,userForm.productsCategory);
router.route("/:id/cart").post(authentication,userForm.cartAdding);
router.route("/:id/cart").get(authentication,userForm.displayCart);
router.route("/:id/wishlist").post(authentication,userForm.addWishlist);
router.route('/:id/wishlist').get(authentication,userForm.displayWishlist);
router.route('/:id/wishlist').delete(authentication,userForm.removeWishlist);
// router.route('/:id/editproduct').post(authentication);

module.exports = router;
