const jwt = require("jsonwebtoken"); // jsonwebtoken - create and verify tokens for authorization 


const generateToken = (id) => {
	return jwt.sign({id}, process.env.JWT_SECRET, {expiresIn: "30d"});
}


module.exports = generateToken;