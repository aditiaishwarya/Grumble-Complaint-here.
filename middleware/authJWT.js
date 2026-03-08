const jwt = require('jsonwebtoken');

module.exports = function(req, res, next){
    // const token = req.header('Authorization');
    const header = req.headers.authorization;
       console.log("LOGIN SECRET:", process.env.JWT_SECRET);

    if(!header) return res.status(401).json({message: "no token"});
    // Remove "Bearer"
    const token = header.split(" ")[1];
    try{
       const decoded = jwt.verify(token,process.env.JWT_SECRET);
    //    const decoded = jwt.verify(token,"secret");
       req.user = decoded;
       next();
    }catch(error){
        res.status(401).json({message: error.message});
    }
};
// const jwt = require('jsonwebtoken');

// module.exports = function (req, res, next) {
//   const token = req.header('Authorization');

//   if (!token)
//     return res.status(401).json({ message: "jwt must be provided" });

//   try {
//     const decoded = jwt.verify(token, "secretkey");
//     req.user = decoded;
//     next();
//   } catch (err) {
//     res.status(401).json({ message: "Invalid token" });
//   }
// };