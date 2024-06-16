const express = require("express");
const {
  getAllBlog,
  createBlog,
  updateBlog,
  deleteBlog,
  getBlogById,
  getUserBlog,
} = require("../Controller/blogController");

const router = express.Router();

router.get("/allBlogs", getAllBlog);
router.post("/createBlog", createBlog);
router.put("/updateBlog/:id", updateBlog);
router.delete("/deleteBlog/:id", deleteBlog);
router.get("/getBlog/:id", getBlogById);
router.get("/userBlog/:id", getUserBlog);

module.exports = router;
