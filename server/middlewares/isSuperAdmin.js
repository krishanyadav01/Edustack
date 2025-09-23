import jwt from "jsonwebtoken";

const isSuperAdmin = async (req, res,next) => {

    const superAdminId = process.env.SUPER_ADMIN_ID;
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
        if(req.id!==superAdminId){
            return res.status(401).json({
                message:"Not a SuperAdmin",
                success:false
            })
        }
        next();//next controller is called check course.route.js
    } catch (error) {
        console.log(error);
    }
}

export default isSuperAdmin;