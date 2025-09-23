import jwt from "jsonwebtoken";

const isAuthenticated = async (req, res,next) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({
                message: "User not authenticated",
                success: false
            });//unauthorised
        }
        const decode = await jwt.verify(token, process.env.SECRET_KEY);
        if (!decode) {
            return res.status(401).json({
                message: "Invalid Token",
                success: false
            })
        }
        req.id = decode.userId;
        next();//next controller is called check course.route.js
    } catch (error) {
        console.log(error);
    }
}

export default isAuthenticated;