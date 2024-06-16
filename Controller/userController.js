const userModel = require("../Model/userModel");
const bcrypt = require("bcrypt");

//get all user
exports.getAllUser = async (req, res) => {
  try {
    const user = await userModel.find({});
    return res.status(200).send({
      userCount: user.length,
      message: "all User data get successfully",
      success: true,
      user,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      message: "Error in get all user",
      success: false,
      error,
    });
  }
};

//new user
exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(400).send({
        message: "fill all Fields",
        success: false,
      });
    }
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(401).send({
        message: "User already exist",
        success: false,
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new userModel({ username, email, password: hashedPassword });
    await user.save();
    return res.status(200).send({
      message: "User created successfully",
      success: true,
      user,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      message: "Error in Register",
      success: false,
      error,
    });
  }
};

//login user
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(401).send({
        message: "fill all Fields",
        success: false,
      });
    }
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(401).send({
        message: "Email is not registered",
        success: false,
      });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).send({
        message: "Invalid username or password",
        success: false,
      });
    }
    return res.status(200).send({
      message: "Login Success",
      success: true,
      user,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      message: "Error in Login",
      success: false,
      error,
    });
  }
};
