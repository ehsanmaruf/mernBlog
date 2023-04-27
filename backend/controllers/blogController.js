const { default: mongoose } = require("mongoose");
const Blog = require("../model/Blog");
const User = require("../model/User");

const getAllBlog = async (req, res, next) => {
  let blogs;
  try {
    blogs = await Blog.find();
  } catch (err) {
    return console.log(err);
  }
  if (!blogs) return res.status(404).json({ message: "No blogs found!" });
  return res.status(200).json({ blogs });
};

const addBlog = async (req, res, next) => {
  const { title, description, image, user } = req.body;
  let existingUser;

  try {
    existingUser = await User.findById(user);
  } catch (err) {
    return console.log(err);
  }
  if (!existingUser)
    return res.status(404).json({ message: "Unable to find user of this ID!!" });

  let blog = new Blog({
    title,
    description,
    image,
    user,
  });
  try {
    //for transactional queries...
    //i.e. Multiple queries under a single transaction.
    const session = await mongoose.startSession();
    session.startTransaction();
    await blog.save({ session }); //session object is passed bcz of only this user to be saved
    existingUser.blogs.push(blog);
    await existingUser.save({session});
    await session.commitTransaction();
  } catch (err) {
    return res.status(500).json({message:err});
  }
  return res.status(201).json({ blog });
};

const updateBlog = async (req, res, next) => {
  const blogID = req.params.id;
  const { title, description, image} = req.body;
  let blog;
  try {
      blog = await Blog.findByIdAndUpdate(blogID, {
      title,
      description,
      image,
    });
  } catch (err) {
    return console.log(err);
  }
  if (!blog) return res.status(500).json({ message: "Unable to update!" });
  return res.status(200).json({ blog });
};

const getIndividualBlog = async (req, res, next) => {
  const blogID = req.params.id;
  let blogs;
  try {
    blogs = await Blog.findById(blogID);
  } catch (err) {
    return console.log(err);
  }
  if (!blogs) return res.status(404).json({ message: "No blogs found!" });
  return res.status(200).json({ blogs });
};

const deleteBlog = async (req, res, next) => {
  const blogID = req.params.id;
  let blog;
  try {
    blog = await Blog.findByIdAndRemove(blogID).populate('user');
    await blog.user.blogs.pull(blog);
    await blog.user.save();
  } catch (err) {
    return console.log(err);
  }
  if (!blog) return res.status(404).json({ message: "Unable to delete!" });
  return res.status(200).json({ message: "Successfully Deleted!" });
};

//show blogs of user!
const getByUserID = async (req, res, next) => {
  const userID = req.params.id;
  let userBlogs;
  try{
    userBlogs = await User.findById(userID).populate('blogs')
  }catch(err){
    return console.log(err);
  }
  if (!userBlogs) return res.status(404).json({ message: "No blog found!" });
  return res.status(200).json({ blogs: userBlogs });
};

module.exports = {
  getAllBlog,
  addBlog,
  updateBlog,
  getIndividualBlog,
  deleteBlog,
  getByUserID,
};
