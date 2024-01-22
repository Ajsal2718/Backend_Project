const express = require("express");
const router = express();
const { adminAuth } = require("../middleware/adminAuth.js");
const adminForm = require("../controller/adminForm.js");
const upload = require("../utils/multer");

router.route('/admin/login').post(adminForm.adminLogin);
router.route('/admin/user').get(adminAuth,adminForm.seeUsers);
router.route('/admin/getUser/:id').get(adminAuth,adminForm.useridFind);
router.route('/admin/getProduct').get(adminAuth,adminForm.displayProduct);
router.route('/admin/product/:id').get(adminAuth,adminForm.ProductById);
router.route('/admin/product/category/:id').get(adminAuth,adminForm.productsCategory);
router.route('/admin/addporduct').post(adminAuth,upload.single('image'),adminForm.addproducts);
router.route('/admin/updateproduct/:id').put(adminAuth,upload.single("image"),adminForm.updateProduct)
router.route('/admin/deleteproduct/:id').delete(adminAuth,adminForm.productDelet)



module.exports = router