const Complaint = require("../models/Complaint");

exports.createComplaint = async (req, res) => {
  console.log(req.user);
  try {

    const complaint = await Complaint.create({
      student: req.user.id,
      fullName: req.user.fullName,
      roll: req.user.roll,
      category: req.body.category,
      description: req.body.description
    });

    res.status(201).json({
      message: "Complaint registered",
      complaint
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Failed to create complaint",
      error: error.message
    });

  }
};

// This controller is already saving data/complaints to the db.
// So, no need to get the complant and save again.
//Once a response is sent, Express stops the chain.
// The next handler will never run. 