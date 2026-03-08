const express = require("express");
const router = express.Router();

const complaintController = require("../Controllers/complaintController");
const authController = require("../middleware/authJWT"); // middleware

router.post(
  "/complaint",
  authController,
  complaintController.createComplaint,
  async (req, res) => {
    try {
      const complaint = new Complaint(req.body);
      await complaint.save();
      res.status(201).json({ message: "Complaint registered." });
    } catch (error) {
      res.status(500).json({ error: error.message });
      console.log(error.message);
    }
  },
);

module.exports = router;


