const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
// const cookie = require('cookie-parser');

// register user
const register = async (req, res) => {
  try {
    const {
      fullname,
      username,
      password,
      confirmPassword,
      profilePhoto,
      gender,
    } = req.body;

    // check if all fields exist
    if (!fullname || !username || !password || !confirmPassword || !gender) {
      return res.status(400).json({
        message: `All fields are required`,
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        message: `Passwords should match`,
      });
    }

    // check if user already exists
    const user = await User.findOne({ username });
    if (user) {
      return res.status(400).json({
        message: `Username already exists`,
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // profile photo
    const generateAvatarUrl = (user) => {
      const name = user.fullname || user.username || "Guest User";
      const avatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(
        name
      )}&background=0D8ABC&color=fff&rounded=true`;
      return avatar;
    };

    // register and create a new user
    const newUser = new User({
      fullname,
      username,
      password: hashedPassword,
      profilePhoto: generateAvatarUrl(req.body),
      gender,
    });

    await newUser.save();

    if (newUser) {
      res.status(200).send({
        success: true,
        message: "User created successfully",
      });
    } else {
      res.status(404).send({
        success: false,
        message: "Failed to register user. Try again",
      });
    }
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// login user
const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // find if user exists (has been registered)
    const currentUser = await User.findOne({ username });
    if (!currentUser) {
      res.status(404).send({
        success: false,
        message: "User doesn't exist",
      });
    }

    const passwordMatch = await bcrypt.compare(password, currentUser.password);
    if (!passwordMatch) {
      res.status(404).send({
        success: false,
        message: "Incorrect password or username",
      });
    }

    // create access token
    const accessToken = jwt.sign(
      {
        userId: currentUser._id,
        username: currentUser.username,
      },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: "24h",
      }
    );

    res
      .status(200)
      .cookie("accessToken", accessToken, {
        maxAge: 1 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: "strict",
      })
      .json({
        success: true,
        _id: currentUser._id,
        username: currentUser.username,
        fullname: currentUser.fullname,
        profilePhoto: currentUser.profilePhoto,
        accessToken,
      });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const logout = (req,res) => {
    try {
        return res.status(200).cookie("accessToken","", {maxAge:0}).json({
            success: true,
            message: "Logged out successfully."
        })
    } catch (error) {
        console.log(error);
    }
}

module.exports = { register, login, logout };