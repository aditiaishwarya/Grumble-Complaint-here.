const mongoose = require("mongoose");
const validator = require("validator");
const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: [true, "Please, provide your name"],
  },
//   secondName: {
//     type: String,
//     required: false,
//   },
//   lastName: {
//     type: String,
//     required: [true, "Please, provide your name"],
//   },
  email: {
    type: String,
    unique: true,
    lowercase: true,
    trim: true,
    // Way_01
    match: [/^\w+([\.-]?\w+)*@nitp\.ac\.in$/, 'Please use a valid @nitp.ac.in email address'],

    //Way_02
    // validate: {
    //   validator: function (v) {
    //     return v.endsWith("@nitp.ac.in");
    //   },
    //   message: (props) => `${props.value} is not a valid NITP email!`,
    // },
    validate: [validator.isEmail, "Please, provide a valid email"],
  },
  roll:{
    type: Number,
    minlength: 7,
    require: [true, "Please provide your roll"]
  },
  password: {
    type: String,
    required: [true, "Please provide a password"],
    minlength: 3,
    select: false, // The password will be hidden automatically or the field will not be returned by default when querying the DB.
  },
  passwordConfirm: {
    type: String,
    required: [true, "Please confirm your password"],
    // validate: { // checking password in the schema only.
    //     validator: function(el){
    //         return el == this.password;
    //     },
    //     message: 'Password are not the same!'
    //     }
  },
  role: {
    type: String,
    enum: ["student", "admin", "staff"],
    default: "student",
  },
  roomNumber: {
    type: Number,
    required: true,
  },
});

// Removing the confirm password, so that it won't get stored in DB
// userSchema.pre("save", function(next){
//     // this.passwowrdConfirm = undefined;
//     this.passwordConfirm = undefined;
//     next();
// });
userSchema.pre("save", async function () {
  this.passwordConfirm = undefined;
});

module.exports = mongoose.model("User", userSchema);
