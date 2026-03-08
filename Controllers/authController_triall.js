const User = require('../models/user');

exports.registerUser = async (req, res) => {
  const { name, password } = req.body; // User sends 'name' instead of 'email'

  try {

    // 1. Clean the name (remove extra spaces)
    const nameParts = name.trim().split(/\s+/);
    let emailPrefix = "";

    if (nameParts.length === 1) {
      // Single word name: "Aditia" -> aditia
      emailPrefix = nameParts[0].toLowerCase();
    } else {
      // Multiple words: "Aditia Kumar Singh" -> aditias (First word + first letter of last word)
      const firstName = nameParts[0].toLowerCase();
      const lastWordFirstLetter = nameParts[nameParts.length - 1][0].toLowerCase();
      emailPrefix = `${firstName}${lastWordFirstLetter}`;
    }

    // 2. Attach the domain
    const generatedEmail = `${emailPrefix}@nitp.ac.in`;

    // 3. Save to MongoDB
    const newUser = new User({ 
      name: name.trim(),
      email: generatedEmail, 
      password: password 
    });

    await newUser.save();
    
    res.status(201).json({ 
      message: "Registration successful!", 
      emailGenerated: generatedEmail 
    });

  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ message: "An account with this generated email already exists." });
    }
    res.status(500).json({ error: err.message });
  }
};
