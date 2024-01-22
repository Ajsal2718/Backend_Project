const userModel = require("../model/UserSchema");
const productModel = require("../model/product");
const bcrypt = require("bcrypt");
// const cookieParser = require("cookie-parser");
// const { signToken } = require("../middleware/jwt");
const jwt = require("jsonwebtoken");
const { tryCatch } = require("../middleware/trycatchHandler");

////////////// Sign Up ///////////////////////

const userSignUp = async (req, res) => {
  try {
    // console.log(req.body);

    const findEmail = await userModel.findOne({ email: req.body.email });

    if (findEmail) {
      return res.status(401).json({
        alert: "401 error",
        message: "Email Already In Use",
      });
    } else {
      const user = await userModel.create(req.body);

      return res.status(201).json({
        user,
        message: "User Created Succesfully",
      });
    }
  } catch (error) {
    console.log("Error creating user:", error);
    return res.status(500).json({
      alert: error.message,
      message: "Internal server error. Please try again later",
    });
  }
};

///////// Login ////////////////

const login = tryCatch(async (req, res) => {
  const { email, password } = req.body;
  const userDetials = await userModel.aggregate([{ $match: { email: email } }]);
  // console.log(userDetials);
  let hashPassword = userDetials[0].password;

  if (!userDetials) {
    res.status(401).json({
      success: false,
      message: err.message,
    });
  }

  const result = await bcrypt.compare(password, hashPassword);

  if (!result) {
    res.status(401).json({
      success: false,
      message: "Password is incorrect",
    });
    return;
  }

  const accessToken = jwt.sign(
    { email: email, id: password },
    "123456"
  );
  console.log(accessToken);
  console.log("Login Successful");

  res.status(202).cookie("token", accessToken).json({
    success: true,
    message: "Successful login",
  });
});

////////////// Show Products /////////////////

const products = tryCatch(async (req, res) => {
  const productData = await productModel.find();
  if (!productData) {
    res.status(401).json({
      success: false,
      message: "No products in here",
    });
  } else {
    res.status(201).json(productData);
  }
});

////Ajsal2718
//////////// Products By Id ///////////////
const productId = tryCatch(async (req, res) => {
  const id = req.params.id;
  // console.log(id);
  const productsFind = await productModel.findById(id);
  if (!productsFind) {
    res.status(401).json({
      success: false,
      message: "Product Not Found",
    });
  } else {
    res.status(201).json(productsFind);
  }
});

/////////////// Products Category ////////////////
const productsCategory = tryCatch(async (req, res) => {
  const cate = req.params.id;

  const categoryFind = await productModel.aggregate([
    {
      $match: { category: cate },
    },
  ]);

  if (!categoryFind || categoryFind.length === 0) {
    res.status(404).json({
      success: false,
      message: "Category not found",
    });
  } else {
    res.status(201).json(categoryFind);
  }
});

////////////// add product to the user cart /////////////

const cartAdding = tryCatch(async (req, res) => {
  const { id: userid } = req.params;
  // console.log(userid);

  const addProduct = await productModel.findById(req.body._id);
  const checkUser = await userModel.findById(userid);

  if (!addProduct && !checkUser) {
    res.status(404).json({
      success: false,
      message: "User id or product id get inccorrect",
    });
  } else {
    const isExist = checkUser.cart.find((item) => item._id == req.body._id);

    if (isExist) {
      res.status(404).send("item is already in cart");
    } else {
      checkUser.cart.push(addProduct);
      await checkUser.save();
      res.status(201).json(checkUser);
    }
  }
});

//////////////// view product from cart ///////////////

const displayCart = tryCatch(async (req, res) => {
  const id = req.params.id;
  // console.log(id);

  const userCheck = await userModel.findById(id);
  // console.log(userCheck);

  if (!userCheck) {
    res.status(404).json({
      success: false,
      message: "Invalid Product",
    });
  } else {
    const cartData = userCheck.cart;
    res.status(201).json(cartData);
  }
});

///////////////// add to wish list ///////////////

const addWishlist = tryCatch(async (req, res) => {
  const userid = req.params.id;
  // const productid = req.body.id;

  const addProduct = await productModel.findById(req.body._id);
  const checkuser = await userModel.findById(userid);

  if (!addProduct && !checkuser) {
    res.status(404).json({
      success: false,
      message: "User id or may Product id get inccorect",
    });
  } else {
    const isExist = checkuser.wishilist.find(
      (item) => item._id == req.body._id
    );

    if (isExist) {
      res.status(404).send("item is already in wishlist");
    } else {
      checkuser.wishilist.push(addProduct);
      await checkuser.save();
      res.status(201).json(checkuser);
    }
  }
});

////////////// view product from wishlist //////////////

const displayWishlist = tryCatch(async (req, res) => {
  const id = req.params.id;

  const userCheck = await userModel.findById(id);

  if (!userCheck) {
    res.status(404).json({
      success: false,
      message: "Invalid Product",
    });
  } else {
    const wishData = userCheck.wishilist;
    res.status(201).json(wishData);
    // console.log(wishData);
  }
});

//////////////// delete wish list items ///////////////

const removeWishlist = tryCatch(async (req, res) => {
  const userid = req.params.id;

  const user = await userModel.findById(userid);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }

  const { wishilist } = user;
  const productRemove = wishilist.find((product) =>
    product._id.equals(req.body._id)
  );

  if (productRemove) {
    const updateWishlist = wishilist.filter(
      (product) => product !== productRemove
    );

    user.wishilist = updateWishlist;

    const updateUser = await user.save();

    res.status(201).json({
      message: "Product Successfully removed from wishlist",
      data: updateUser.wishilist,
    });
  } else {
    return res.status(401).json({
      success: false,
      message: "Product not fond in the wishlist",
    });
  }
});


module.exports = {
  userSignUp,
  login,
  products,
  productId,
  productsCategory,
  cartAdding,
  displayCart,
  addWishlist,
  displayWishlist,
  removeWishlist,
};
