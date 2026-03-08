const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User" // This means student must be a object id...when you create user MongoDB auto creates an object id for it,we have to provide it while sending request.
    },
    fullName: String,
    roll:{
        type: Number,
        minlength: 7,
        unique: true
    },
    category:{
        type: String,
        required: [true, "Please, provide valid category"],
    },
    description:{
        type: String,
        required: [true, "Please, provide a description"],
    },
    status: {
        status: {
            type: String,
            default: "Pending"
        }
    }, 

assignedTo: {
    type: 
     mongoose.Schema.Types.ObjectId,
     ref: "User"
}
},
  {   timestamps: true
});

module.exports = mongoose.model("Complaint", complaintSchema);

