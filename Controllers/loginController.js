// // Backend: login controller
// exports.loginUser = async (req, res) => {
//   const { email, password } = req.body;
//   const user = await User.findOne({ email });

//   if (user && await user.comparePassword(password)) {
//     // 1. Save to Session (for the /me route)
//     req.session.userId = user._id; 
    
//     // 2. Optional: Send a token if you still want to use localStorage
//     // const token = generateToken(user._id); 

//     return res.status(200).json({ 
//         message: "Logged in!",
//         name: user.name,
//         email: user.email
//         // token: token 
//     });
//   } else {
//     return res.status(401).json({ message: "Invalid email or password" });
//   }
// };


// loginController.js
const jwt = require("jsonwebtoken");
const User = require("../models/User");

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user || !(await user.comparePassword(password))) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  const token = jwt.sign(
    { id: user._id },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  res.status(200).json({
    token,
    user: {
      name: user.name,
      email: user.email
    }
  });
};