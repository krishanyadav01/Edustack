import jwt from "jsonwebtoken";

export const generateToken = (res, user, message) => {
    const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, { expiresIn: '1d' });
    return res.status(200).cookie("token", token, { httpOnly: true,secure:true, sameSite: 'none', maxAge: 24 * 60 * 60 * 60 }).json({
        success:true,
        message,
        user:user
    });//creates a cookie named token with token and send a json object response with message and user object
}