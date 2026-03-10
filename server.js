require('dotenv').config();
const express = require('express');
// const dotenv = require('dotenv').config();
const path = require("path");
const app = express();
const mongoose = require('mongoose');
app.use(express.json());
const User = require('./models/user');
const Complaint = require('./models/Complaint');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken'); 
const auth = require('./middleware/authJWT');

app.use(express.static('public'));
// const authController = require('./Controllers/authController');

const complaintController = require("./Controllers/complaintController");
const authController = require("./middleware/authJWT"); // middleware
const compression = require('compression'); // to compress daat like html file etc.
// console.log(process.env.MONGO_URI); DEBUG...

// Way_01 good for DEBUG...
// if (!process.env.MONGO_URI) {
//   console.log("MONGO_URI is missing");
//   process.exit(1);
// }
// Way_02
mongoose.connect(process.env.MONGO_URI).then(()=>console.log("MongoDB Connected")).catch(err => console.log(err));

// GET request
app.get('/',(req, res) =>{
    res.send("API is running...");
});
//------------------------------
app.use(express.static(path.join(__dirname, "public")));
//------------------------------
// POST request
// app.post('/register', async (req, res)=>{
//     try{
//     const user = new User(req.body);
//     await user.save();
//     res.status(201).json({message: "User registere"});
//     } catch(error){
//         res.status(500).json({error:error.message});
//     }
// });
//--------------------------------------------------------

// app.post('/register', async (req, res) => {
//   try {
//     const hashedPassword = await bcrypt.hash(req.body.password, 10); // Why 10?

//     const user = new User({
//       ...req.body, // Why ...?
//       password: hashedPassword
//     });

//     await user.save();
//     res.status(201).json({ message: "User registered" });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });
app.post('/register', async (req, res) => {
    // console.log(req.body); //  DEBUG

  try {
     if (req.body.password !== req.body.passwordConfirm) {
      return res.status(400).json({ message: "Passwords are not the same" });
    }

    const existingUser = await User.findOne({ email: req.body.email });

    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    const user = new User({
      fullName: req.body.fullName,
      // secondName: req.body.secondName,
      // lastName: req.body.lastName,
      email: req.body.email,
      roll: req.body.roll,
      password: hashedPassword,
      passwordConfirm: req.body.passwordConfirm, // ⭐ important
      role: req.body.role,
      roomNumber: req.body.roomNumber
    });

    await user.save();

    res.status(201).json({ message: "User registered successfully" });

  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});
//------------------------------
//-----------------------------------------------------
// Login

app.post('/login', async (req, res) => {
  // const user = await User.findOne({ email: req.body.email });
  const user = await User.findOne({ email: req.body.email }).select("+password"); // as select: false is in our schema

  if (!user) return res.status(400).json({ message: "User not found" });

  const isMatch = await bcrypt.compare(req.body.password, user.password);

  // DEBUG...
//   console.log(req.body.password);
//   console.log("\n");
//   console.log(user.password);
  

  if (!isMatch) return res.status(400).json({ message: "Wrong password" });
  // DEBUG...
    //  console.log("Match Password: ", isMatch);
      //  console.log("LOGIN SECRET:", process.env.JWT_SECRET);

  const token = jwt.sign(
    { id: user._id, role: user.role, roll: user.roll, fullName: user.fullName }, // payload
    // "secretkey",
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  // res.json({ token });
  res.json({
  token,
  user: {
    name: user.fullName,
    email: user.email
  }
});
});

//------------------------------------------
//----------------------------------------------------------
// Raise Complaint

app.post(
  "/complaint",
  authController,
  complaintController.createComplaint,
  // async (req, res) => {
    // try {
    //   const complaint = new Complaint(req.body);
    //   // const complaint = new Complaint({
    //   //   category: req.body.category,
    //   //   description: req.body.description,
    //   //   roll: req.body.roll,
    //   //   fullName: req.body.fullName
    //   // });
    //   await complaint.save();
    //   res.status(201).json({ message: "Complaint registered." });
    // } catch (error) {
    //   res.status(500).json({ error: error.message });
    //   console.log(error.message);
    // }
  // },
);
    
//------------------------------

// For checking whether JWT authentication working or not?
// Not a feature of our project, rather just for learning.
app.get('/protected', auth, (req, res)=>{
    res.json({message: "Protected route accessed"});
});
//---------------------------------------------------
// all-complaints for admin only
function adminOnly(req, res, next){
    if(req.user.role !== "admin")
        return res.status(403).json({message: "Admin only can access this"});
    next();
}
app.get('/all-complaints', auth, adminOnly, async(req, res) =>{
    try{
    const complaints = await Complaint.find().populate('student');
    res.status(200).json(complaints);
    }catch(error){
        res.status(500).json({message: error.message});
    }
})
//------------------------------------------------
app.get('/me', auth, async (req, res) => {

  const user = await User.findById(req.user.id).select("firstName email");

  res.json({
    name: user.firstName,
    email: user.email
  });

});
//------------------------------------------------
// assigning complaint.
app.put('/complaint/:id/assign', auth, adminOnly, async (req, res) => {
  const complaint = await Complaint.findByIdAndUpdate(req.params.id,
    { assignedTo: req.body.staffId,
      status: "Assigned" },
      {new: true} 
    );
    res.json(complaint);
});
//----------------------------------------------
// Updating status
app.put('/complaint/:id/status', auth, async (req, res) =>{
  const complaint = await Complaint.findById(req.params.id);

  if(complaint.assignedTo.toString() !== req.user.id) 
    return res.status(403).json({message: "Not your task"});

  complaint.status = req.body.status;
  await complaint.save();
  
  res.json(complaint);

});
// ------------------------------------
// View my-own complaints
app.get('/my-complaints', auth, async(req, res) =>{
  const complaints = await Complaint.find({student: req.user.id});
  res.json(complaints);
});

// Filter complaints by floor
app.get('/complaints-by-floor/:floor', auth,adminOnly, async(req, res) =>{
  const users = await Complaint.find({floor: req.params.floor});
  const userIds = users.map(u => u._id);

  const complaints = await Complaint.find({student: {$in: userIds}});
  res.json(complaints);
});
//-----------------------------------------
app.get('/staff-complaints', auth, async (req, res) => {
  const complaints = await Complaint.find({
    assignedTo: req.user.id
  });

  res.json(complaints);
});

app.use(compression()); // to compress daat like html file etc.
const port = process.env.port || 3000;
app.listen(port, () =>{
    console.log("Server running on port 5000");
});

