import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/generateToken.js";
import { deleteMediaFromCloudinary, uploadMedia } from "../utils/cloudinary.js";
import { oauth2client } from "../utils/googleConfig.js";
import axios from "axios";

export const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "All fileds are required"
            })
        }
        const user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({
                success: false,
                message: "User already exists with this email"
            })
        }
        
        const hashedPassword = await bcrypt.hash(password, 10);//password is hashed deafult salt length is 10npm
        await User.create({
            name,  //this is equal to name:name when same dont need to write both
            email,
            password: hashedPassword
        })
        return res.status(201).json({
            success: true,
            message: "Account Registered Successfully"
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Failed to register"
        })
    }
}

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "All fileds are required"
            })
        }
        const user = await User.findOne({ email });
        const userWithoutPassword=await User.findOne({email}).select("-password");       //user state must be stored in redux store without password
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Incorrect email or password"
            })
        }
        const isPasswordMatched = await bcrypt.compare(password, user.password);//compares password and hashedpassword stored
        if (!isPasswordMatched) {
            return res.status(400).json({
                success: false,
                message: "Incorrect Email Or Password"
            })
        }
        generateToken(res, userWithoutPassword   , `Welcome back ${user.name}`);
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Failed to login"
        })
    }
}

export const logout = async (req, res) => {
    try {
        return res.status(200).cookie("token", "", { maxAge: 0 }).json({        //token is passed as empty and age is set to 0 hence 
            message: "Logged Out successfully",
            success: true
        })
    } catch (error) {
        return res.status(500).json(
            {
                success: false,
                message: "Failed to logout"
            }
        )
    }
}

export const getUserProfile = async (req, res) => {
    try {
        const userId = req.id//from middleware isAuthenticated
        const user = await User.findById(userId).select("-password").populate("enrolledCourses");//dont need password
        if (!user) {
            return res.status(404).json(
                {
                    message: "Profile Not Found",
                    success: false
                }
            )
        }
        return res.status(200).json({
            success: true,
            user
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Failed to load User",
            sucess: false
        })
    }
}

export const updateProfile = async (req, res) => {
    try {
        const userId = req.id;
        const { name } = req.body;
        const profilePhoto = req.file;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json(
                {
                    message: "User Not Found",
                    success: false
                }
            )
        }

        //extract public id of the old image from url if it exists
        if (user.photoUrl) {
            const publicId = user.photoUrl.split("/").pop().split(".")[0];//extract public id
            deleteMediaFromCloudinary(publicId);
        }

        //upload new photo
        const cloudResponse = await uploadMedia(profilePhoto?.path);
        const photoUrl = cloudResponse.secure_url;

        const updatedData = { name, photoUrl };
        const updatedUser = await User.findByIdAndUpdate(userId, updatedData, { new: true }).select("-password");

        return res.status(200).json({
            message: "Profile Updated Succesfully",
            updatedUser,
            success: true
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Failed to update Profile",
            sucess: false
        })
    }
}

export const googleLogin = async (req, res) => {
    try {
        const code = req.query.code;
        console.log(code);
        const googleRes = await oauth2client.getToken(code);
        oauth2client.setCredentials(googleRes.tokens);

        const userRes = await axios.get(
            `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${googleRes.tokens.access_token}`
        )
        const { email, name, picture, id } = userRes.data;
        console.log(email);
        let user = await User.findOne({ email });
        if (!user) {
            user = await User.create({
                name,
                email,
                photoUrl: picture,
                googleId: id.toString()
            })
        }
        if (!user.googleId) {
            user.googleId = id;
            await user.save();
        }
        generateToken(res, user, `Welcome back ${user.name}`);
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Failed to login"
        })
    }
}