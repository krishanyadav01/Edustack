import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
dotenv.config({});

cloudinary.config({
    api_secret: process.env.API_SECRET,
    api_key: process.env.API_KEY,
    cloud_name: process.env.CLOUD_NAME
});

export const uploadMedia = async (file) => {
    try {
        const uploadResponse = await cloudinary.uploader.upload(file, {
            resource_type: "auto"  //whatever the file is take is auto type
        });
        return uploadResponse;
    } catch (error) {
        console.log(error);
    }
}

export const deleteMediaFromCloudinary = async (publicId) => {
    try {
        await cloudinary.uploader.destroy(publicId);
    } catch (error) {
        console.log(error);
    }
}


export const deleteVideoFromCloudinary = async (publicId) => {
    try {
        await cloudinary.uploader.destroy(publicId, { resource_type: "video" });
    } catch (error) {
        console.log(error);
    }
}



export const uploadPdf = async (filePath, originalFilename) => {
    try {
        const result = await cloudinary.uploader.upload(filePath, {
            resource_type: "raw",
            use_filename: true,
            unique_filename: true,                        //same file name gets converted to different name when store on cloudinary
            public_id: `${originalFilename}`              //for pdf we need to do this also so that it stored in pdf format
        });
        return result;
    } catch (error) {
        console.log("Error uploading PDF:", error);
        throw error;
    }
};


export const deletePdfFromCloudinary = async (publicId) => {
    try {
        await cloudinary.uploader.destroy(publicId, { resource_type: "raw" });
    } catch (error) {
        console.log(error);
    }
}

