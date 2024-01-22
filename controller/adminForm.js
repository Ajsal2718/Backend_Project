const userModel = require("../model/UserSchema");
const productModel = require("../model/product");
const { tryCatch } = require("../middleware/trycatchHandler");
const { signToken } = require("../middleware/jwt");
const cloudinary = require("../utils/cloudinary");

////////////// Admin Login ///////////////
const adminLogin = tryCatch(async (req, res) => {
  const admin = {
    username: process.env.Admin_username,
    password: process.env.Admin_password,
  };

  const { username, password } = req.body;

  const validator = password === admin.password && username === admin.username;

  if (validator) {
    console.log("Login Success");
    res.status(202).cookie("adminAuth", signToken).json({
      succes: true,
      message: "Successfull Login",
    });
  } else {
    res.status(400).send("validation failed: incorrect username or password");
  }
});

/////////////////// View all users ///////////////////

const seeUsers = tryCatch(async (req, res) => {
  const userData = await userModel.find();
  if (userData?.length === 0) {
    res.status(400).send("Database error");
  } else {
    res.status(202).json(userData);
  }
});

/////////////// User By id /////////////

const useridFind = tryCatch(async (req, res) => {
  const id = req.params.id;

  const checkUser = await userModel.findOne({ _id: id });

  if (!checkUser) {
    res.status(404).json({
      succes: false,
      message: "User not fond",
    });
  } else {
    res.status(202).json(checkUser);
  }
});

//////////// Show Products //////////////

const displayProduct = tryCatch(async (req, res) => {
  const checkProduct = await productModel.find();

  if (!checkProduct) {
    res.status(404).json({
      succes: false,
      message: "Product not found",
    });
  } else {
    res.status(202).json(checkProduct);
  }
});

//////////////////// Product by id ////////////////

const ProductById = tryCatch(async (req, res) => {
  const  id  = req.params.id;

  const productId = await productModel.findOne({ _id: id });

  if (!productId) {
    res.status(404).json({
      succes: false,
      message: "Product not found",
    });
  } else {
    res.status(202).json(productId);
  }
});

////////////// Show Products category /////////////
const productsCategory = tryCatch(async (req, res) => {
  const cate = req.params.id;
  const categoryFind = await productModel.aggregate([
    { $match: { category: cate } },
  ]);

  if (!categoryFind || categoryFind.length === 0) {
    res.status(404).json({
      success: false,
      message: "category not found",
    });
  } else {
    res.status(202).json(categoryFind);
  }
});

///////////////// Add product in mongodb /////////////////
const addproducts = tryCatch(async (req, res) => {
  const { title, description, price, category } = req.body;
  const existingproduct = await productModel.findOne({ title: title });

  if (!existingproduct) {
    const adding = await cloudinary.uploader.upload(req.file.path);
    const added = await productModel.create({
      title,
      description,
      price,
      category,
      image: adding.url,
    });
    res.status(202).json({
      success: true,
      message: "successfulyy",
      data: added,
    });
  } else {
    res.status(404).json({
      success: false,
      message: "product not found",
    });
  }
});

////////////////// Update Products ////////////
const updateProduct = tryCatch(async (req, res) => {
  const productId = req.params.id;
  const isExist = await productModel.findById(productId);
  const { title, description, price, category } = req.body;

  if (isExist) {
    const adding = await cloudinary.uploader.upload(req.file.path);
    const product = await productModel.findById(productId);

    product.title = title || product.title;
    product.description = description || product.description;
    product.price = price || product.price;
    product.category = category || product.category;
    product.image = adding.url || product.image;

    await product.save();

    res.status(202).json({
      status: "Success",
      message: "Successfully updated product",
      data: product,
    });
  }
});

///////////////// Product Delete /////////////

const productDelet = tryCatch(async (req, res) => {
  const productId = req.params.id;

  const deleteProduct = await productModel.findByIdAndDelete(productId);

  if (!deleteProduct) {
    res.status(404).json({
      success: false,
      message: "Product not found",
    });
  } else {
    res.status(202).json({
      success: true,
      message: "Product delete successfully",
      data: deleteProduct,
    });
  }
});

module.exports = {
  adminLogin,
  seeUsers,
  useridFind,
  displayProduct,
  productsCategory,
  ProductById,
  addproducts,
  updateProduct,
  productDelet,
};
