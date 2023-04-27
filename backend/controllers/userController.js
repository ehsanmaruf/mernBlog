const User = require("../model/User");
const bcrypt = require("bcrypt");
const saltRounds = 10;

const getAllUser = async(req, res, next) =>{                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       
    let users;
    try{
        users = await User.find();
    }catch(err){
       return console.log(err)
    }
    if(!users) return res.status(400).json({message:"No users found!"});
    return res.status(200).json({users});
}

const signup = async (req, res, next) => {
  const {name, email, password} = req.body;
  let existingUser;
  try {
    existingUser = await User.findOne({email});
  } catch (err) {
       return console.log(err);
  }
  if (existingUser) return res.status(400).json({ message: "User already exist! Login Instead" });
  
  const salt = bcrypt.genSaltSync(saltRounds);
  const hashedPassword = bcrypt.hashSync(password, salt);

  const newUser = new User({
    name,
    email,
    password: hashedPassword,
    blogs: [],
  });
  try {
    await newUser.save();             
  } catch (err) {
    console.log(err);
  }
  return res.status(201).json({ newUser });
};

const login = async (req, res, next) => {
  const {email, password } = req.body;
  let existingUser;
  try {
    existingUser = await User.findOne({ email });
  } catch (err) {
    return console.log(err);
  }
  if (!existingUser)
    return res.status(404).json({ message: "Could not find User!!" });
  
  const isPasswordCorrect = bcrypt.compareSync(password, existingUser.password);
  if (!isPasswordCorrect) {
    return res.status(400).json({ message: "Incorrect Password!!" });
  }
  return res
    .status(200)
    .json({ message: "Login Successfully!", user: existingUser });
};

module.exports = { getAllUser, signup, login };