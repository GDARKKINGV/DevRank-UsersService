import Developer from "../models/dev.model.js";
import { uploadImage } from "../lib/cloudinary.js";
import fs from "fs-extra";

export const profile = async (req, res) => {
  try {
    const devFound = await Developer.findById(req.dev.id);

    if (!devFound) return res.status(400).json({ message: "User not found" });

    res.json({
      id: devFound._id,
      userName: devFound.userName,
      name: devFound.name,
      lastName: devFound.lastName,
      email: devFound.email,
      about: devFound.about,
      profileImage: devFound.profileImage,
      points: devFound.points,
      documents: devFound.documents,
      experience: devFound.experience,
      education: devFound.education,
      skills: devFound.skills,
      socialLinks: devFound.socialLinks,
      createdAt: devFound.createdAt,
      updatedAt: devFound.updatedAt,
      token: token,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateProfile = async (req, res) => {
  const { id, data } = req.body;

  const parsedData = JSON.parse(data);

  try {
    const updateData = { ...parsedData };

    if (req.files?.profileImage) {
      const res = await uploadImage(req.files.profileImage.tempFilePath);
      updateData.profileImage = {
        publicId: res.public_id,
        url: res.secure_url,
      };

      await fs.unlink(req.files.profileImage.tempFilePath);
    }

    const devUpdated = await Developer.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    console.log(devUpdated);

    if (!devUpdated) return res.status(400).json({ message: "User not found" });

    res.json({
      id: devUpdated._id,
      userName: devUpdated.userName,
      name: devUpdated.name,
      lastName: devUpdated.lastName,
      email: devUpdated.email,
      about: devUpdated.about,
      profileImage: devUpdated.profileImage,
      points: devUpdated.points,
      documents: devUpdated.documents,
      experience: devUpdated.experience,
      education: devUpdated.education,
      skills: devUpdated.skills,
      socialLinks: devUpdated.socialLinks,
      createdAt: devUpdated.createdAt,
      updatedAt: devUpdated.updatedAt,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};
