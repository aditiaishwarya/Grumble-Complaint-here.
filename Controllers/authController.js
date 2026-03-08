const User = require('../models/user');
const validateEmail = require('deep-email-validator').validate;

exports.registerUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // 1. Basic syntax check only (Disabling DNS/SMTP/Typo checks)
    // Academic domains like .ac.in often fail these automated network checks
    const verification = await validateEmail({
      email: email,
      validateSMTP: false, // Don't ping the inbox
      validateMX: false,   // Don't check for mail records (often hidden by NITP)
      validateTypo: false, // Don't flag .ac.in as a typo
      validateDisposable: true // Still block "10-minute mail" services
    });

    // 2. Strict NITP Domain Check
    // Since the external library is failing, we manually enforce the requirement
    const isNitpEmail = email.toLowerCase().endsWith('@nitp.ac.in');
    
    if (!verification.valid || !isNitpEmail) {
      return res.status(400).json({ 
        message: "Please use a valid official @nitp.ac.in email address." 
      });
    }

    // 3. Save to MongoDB
    const newUser = new User({ email, password });
    await newUser.save();
    
    res.status(201).json({ message: "Registration successful!" });

  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ message: "This email is already registered." });
    }
    res.status(500).json({ error: "Server error, please try again later." });
  }
};



// const validate = require('deep-email-validator');

// async function isEmailReal(email) {
//   let res = await validate.validate(email);
  
//   // res.valid will be true only if:
//   // 1. Syntax is correct
//   // 2. Domain exists & has MX records
//   // 3. SMTP check confirms mailbox exists
//   // 4. It's NOT a disposable/temporary email
//   return res.valid; 
// }