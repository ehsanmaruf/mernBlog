const express = require("express");
const {
  getAllBlog,
  addBlog,
  updateBlog,
  getIndividualBlog,
  deleteBlog,
  getByUserID,
} = require("../controllers/blogController");

const blogRouter = express.Router();

blogRouter.get("/", getAllBlog);
blogRouter.get("/:id", getIndividualBlog);
blogRouter.post("/add", addBlog);
blogRouter.put("/update/:id", updateBlog);
blogRouter.delete("/:id", deleteBlog);
blogRouter.get("/user/:id", getByUserID);

module.exports = blogRouter;
