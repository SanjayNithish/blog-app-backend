const { default: mongoose } = require("mongoose");
const blogModel = require("../Model/blogModel");
const userModel = require("../Model/userModel");

exports.getAllBlog = async (req, res) => {
  try {
    const blogs = await blogModel.find({}).populate("user");
    if (!blogs) {
      return res.status(200).send({
        success: false,
        message: "no Blog found",
      });
    }
    return res.status(200).send({
      blogCount: blogs.length,
      success: true,
      message: "all blogs",
      blogs,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      message: "Error in getting Blog",
      success: false,
      error,
    });
  }
};

exports.createBlog = async (req, res) => {
  try {
    const { title, description, image, user } = req.body;
    if (!title || !description || !image || !user) {
      return res.status(400).send({
        message: "fill all fields",
        success: false,
      });
    }

    const existingUser = await userModel.findById(user);
    if (!existingUser) {
      return res.status(404).send({
        success: false,
        message: "unable to find user",
      });
    }

    const newBlog = new blogModel({ title, description, image, user });

    const session = await mongoose.connection.startSession();
    session.startTransaction();
    await newBlog.save({ session });
    existingUser.blogs.push(newBlog);
    await existingUser.save({ session });
    await session.commitTransaction();
    session.endSession();

    return res.status(200).send({
      success: true,
      message: "blog created",
      newBlog,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      message: "Error in creating Blog",
      success: false,
      error,
    });
  }
};

exports.updateBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, image } = req.body;
    const blog = await blogModel.findByIdAndUpdate(
      id,
      { ...req.body },
      { new: true }
    );
    return res.status(200).send({
      success: true,
      message: "blog updated",
      blog,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      message: "Error in updating Blog",
      success: false,
      error,
    });
  }
};

exports.deleteBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const blog = await blogModel.findByIdAndDelete(id).populate("user");
    await blog.user.blogs.pull(blog);
    await blog.user.save();
    return res.status(200).send({
      success: true,
      message: "deleted",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      message: "Error in deleting Blog",
      success: false,
      error,
    });
  }
};

exports.getBlogById = async (req, res) => {
  try {
    const { id } = req.params;
    const blog = await blogModel.findById(id);
    if (!blog) {
      console.log(error);
      return res.status(404).send({
        message: "Error in getting Blog by id",
        success: false,
        error,
      });
    }
    return res.status(200).send({
      success: true,
      message: "blog found",
      blog,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      message: "failed to get blog by id",
      success: false,
      error,
    });
  }
};

exports.getUserBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const userBlog = await userModel.findById(id).populate("blogs");
    if (!userBlog) {
      return res.status(404).send({
        message: "Error in getting particular user Blog by id",
        success: false,
        error,
      });
    }
    return res.status(200).send({
      success: true,
      message: "user blogs found",
      userBlog,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      message: "failed to get particular user blog by id",
      success: false,
      error,
    });
  }
};
