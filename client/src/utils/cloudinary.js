import axios from "axios";

export const uploadToCloudinary = async (file) => {
    const cloudName = "dswwwikd3";
    const uploadPreset = "classesProjects";

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", uploadPreset);

    try {
        const res = await axios.post(
            `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
            formData
        );

        return res.data.secure_url;
    } catch (error) {
        console.error("Cloudinary Upload Error", error);
        return null;
    }
};
