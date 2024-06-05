import Developer from "../models/dev.model.js";
import bcrypt from "bcryptjs";
import { createAccessToken } from "../lib/jwt.js";
import jwt from "jsonwebtoken";
import { TOKEN_SECRET } from "../config.js";

export const register = async (req, res) => {
  const { userName, name, lastName, email, password } = req.body;

  try {
    const devFound = await Developer.findOne({ userName });
    if (devFound)
      return res.status(400).json({ error: ["User already exist"] });

    const emailFound = await Developer.findOne({ email });
    if (emailFound)
      return res.status(400).json({ error: ["Email already in use"] });

    const paswordHash = await bcrypt.hash(password, 10);

    const newDev = new Developer({
      userName,
      name,
      lastName,
      email,
      password: paswordHash,
    });

    const devSaved = await newDev.save();
    const token = await createAccessToken({ id: devSaved._id });

    res.json({
      id: devSaved._id,
      userName: devSaved.userName,
      name: devSaved.name,
      lastName: devSaved.lastName,
      email: devSaved.email,
      about: devSaved.about,
      profileImage: devSaved.profileImage,
      points: devSaved.points,
      documents: devSaved.documents,
      experience: devSaved.experience,
      education: devSaved.education,
      skills: devSaved.skills,
      socialLinks: devSaved.socialLinks,
      createdAt: devSaved.createdAt,
      updatedAt: devSaved.updatedAt,
      token: token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  const { userName, password } = req.body;

  try {
    const devFound = await Developer.findOne({ userName });

    if (!devFound) return res.status(400).json({ error: ["User not found"] });

    const passwordMach = await bcrypt.compare(password, devFound.password);

    if (!passwordMach)
      return res.status(401).json({ error: ["Invalid password"] });

    const token = await createAccessToken({
      id: devFound._id,
      userName: devFound.userName,
    });

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

export const logout = (req, res) => {
  return res.send({ status: "OK", data: "Logout successful" });
};

export const verifyToken = async (req, res) => {
  try {
    const token = req.header("Authorization");

    if (!token) return res.status(401).json({ message: "unauthorized" });

    jwt.verify(token, TOKEN_SECRET, async (error, dev) => {
      if (error) return res.status(401).json({ message: "unauthorized" });

      try {
        const devFound = await Developer.findById(dev.id);
        if (!devFound)
          return res.status(400).json({ message: "User not found" });

        return res.json({
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
        return res.status(500).json({ message: error.message });
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
