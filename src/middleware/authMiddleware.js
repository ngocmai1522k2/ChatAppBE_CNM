const jwt = require("jsonwebtoken") ;
const dotenv = require('dotenv');
const User = require('../models/User');
dotenv.config();

const authMiddleware = (req, res, next) => {
    // console.log('token', req.headers.token);
    const token = req.headers.token.split(' ')[1];
    jwt.verify(token, process.env.ACCESS_TOKEN, function (err, user) {
        if (err) {
            return res.status(404).json({
                message: 'The authentication',
                status: 'ERROR',
            });
        }
        const { payload } = user;
        if (user?.isAdmin) {
            next();
        } else {
            return res.status(404).json({
                message: 'The authentication',
                status: 'ERROR',
            });
        }

        // console.log('user', user);
    });
};

const authUserMiddleware = (req, res, next) => {
    console.log('token: ', req.headers.token);

    const token = req.headers.token.split(' ')[1];
    const userId = req.params.id;
    jwt.verify(token, process.env.ACCESS_TOKEN, function (err, user) {
        if (err) {
            return res.status(404).json({
                message: 'The authentication',
                status: 'ERROR',
            });
        }
        const { payload } = user;
        if (user?.isAdmin || user?.id === userId) {
            next();
        } else {
            return res.status(404).json({
                message: 'The authentication',
                status: 'ERROR',
            });
        }

        // console.log('user', user);
    });
};


const protectRoute = async (req, res, next) => {
	try {
		const token = req.cookies.jwt;

		if (!token) {
			return res.status(401).json({ error: "Unauthorized - No Token Provided" });
		}

		const decoded = jwt.verify(token, process.env.JWT_SECRET);

		if (!decoded) {
			return res.status(401).json({ error: "Unauthorized - Invalid Token" });
		}

		const user = await User.findById(decoded.userId).select("-password");

		if (!user) {
			return res.status(404).json({ error: "User not found" });
		}

		req.user = user;

		next();
	} catch (error) {
		console.log("Error in protectRoute middleware: ", error.message);
		res.status(500).json({ error: "Internal server error" });
	}
};


module.exports = {
    authMiddleware,
    authUserMiddleware,
    protectRoute
};

