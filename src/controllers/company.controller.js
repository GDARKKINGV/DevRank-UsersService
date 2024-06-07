import Company from "../models/company.model.js";
import { uploadImage } from "../lib/cloudinary.js";
import fs from "fs-extra";
import bcrypt from "bcryptjs";
import { createAccessToken } from "../lib/jwt.js";
import axios from "axios";
import { OFFER_SERVICE_URL } from "../config.js";

export const createCompany = async (req, res) => {
  const { name, email, password, location, size } = req.body;

  try {
    const companyFound = await Company.findOne({ name });

    if (companyFound)
      return res.status(400).json({ error: ["Company already exist"] });

    const emailFound = await Company.findOne({ email });

    if (emailFound)
      return res.status(400).json({ error: ["Email already in use"] });

    const passwordHash = await bcrypt.hash(password, 10);

    const newCompany = new Company({
      name,
      email,
      password: passwordHash,
      location,
      size,
    });

    const companySaved = await newCompany.save();

    res.json({
      id: companySaved._id,
      name: companySaved.name,
      email: companySaved.email,
      location: companySaved.location,
      size: companySaved.size,
      createdAt: companySaved.createdAt,
      updatedAt: companySaved.updatedAt,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const loginCompany = async (req, res) => {
  const { email, password } = req.body;

  try {
    const companyFound = await Company.findOne({ email });

    if (!companyFound)
      return res.status(400).json({ error: ["Invalid credentials"] });

    const passwordMatch = await bcrypt.compare(password, companyFound.password);

    if (!passwordMatch)
      return res.status(400).json({ error: ["Invalid credentials"] });

    const token = await createAccessToken({ id: companyFound._id });
    res.json({
      id: companyFound._id,
      name: companyFound.name,
      email: companyFound.email,
      location: companyFound.location,
      size: companyFound.size,
      website: companyFound.website,
      description: companyFound.description,
      logo: companyFound.logo,
      offers: companyFound.offers,
      createdAt: companyFound.createdAt,
      updatedAt: companyFound.updatedAt,
      token: token,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getCompanies = async (req, res) => {
  try {
    const companies = await Company.find().lean();

    const companyPromises = companies.map(async (company) => {
      const offersDetails = company.offers.map(async (offerId) => {
        const response = await axios.get(
          `${OFFER_SERVICE_URL}/api/offers/${offerId}`
        );
        return response.data;
      });
      company.offers = await Promise.all(offersDetails);
      return company;
    });

    const companiesWithOffers = await Promise.all(companyPromises);

    res.json(companiesWithOffers);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

export const getCompanyById = async (req, res) => {
  const { companyId } = req.params;

  try {
    const companyFound = await Company.findById(companyId);

    if (!companyFound)
      return res.status(400).json({ message: "Company not found" });

    res.json({
      id: companyFound._id,
      name: companyFound.name,
      email: companyFound.email,
      location: companyFound.location,
      size: companyFound.size,
      website: companyFound.website,
      description: companyFound.description,
      logo: companyFound.logo,
      offers: companyFound.offers,
      createdAt: companyFound.createdAt,
      updatedAt: companyFound.updatedAt,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateCompany = async (req, res) => {
  const { data } = req.body;
  const { companyId } = req.params;

  console.log(data);
  const parsedData = JSON.parse(data);

  try {
    const updateData = { ...parsedData };

    if (req.files?.logo) {
      const res = await uploadImage(req.files.logo.tempFilePath);
      updateData.logo = {
        publicId: res.public_id,
        url: res.secure_url,
      };

      await fs.unlink(req.files.logo.tempFilePath);
    }

    const companyUpdated = await Company.findByIdAndUpdate(
      companyId,
      updateData,
      { new: true }
    );

    if (!companyUpdated)
      return res.status(400).json({ message: "Company not found" });

    res.json({
      id: companyUpdated._id,
      name: companyUpdated.name,
      email: companyUpdated.email,
      location: companyUpdated.location,
      size: companyUpdated.size,
      website: companyUpdated.website,
      description: companyUpdated.description,
      logo: companyUpdated.logo,
      offers: companyUpdated.offers,
      createdAt: companyUpdated.createdAt,
      updatedAt: companyUpdated.updatedAt,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const addOffer = async (req, res) => {
  const { companyId } = req.params;
  const { offerId } = req.body;

  try {
    const companyFound = await Company.findById(companyId);

    if (!companyFound)
      return res.status(400).json({ message: "Company not found" });

    if (companyFound.offers.includes(offerId)) {
      return res.status(400).json({ message: "Offer already added" });
    }

    companyFound.offers.push(offerId);
    const companyUpdated = await companyFound.save();

    res.json({
      id: companyUpdated._id,
      name: companyUpdated.name,
      email: companyUpdated.email,
      location: companyUpdated.location,
      size: companyUpdated.size,
      website: companyUpdated.website,
      description: companyUpdated.description,
      logo: companyUpdated.logo,
      offers: companyUpdated.offers,
      createdAt: companyUpdated.createdAt,
      updatedAt: companyUpdated.updatedAt,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const removeOffer = async (req, res) => {
  const { companyId, offerId } = req.params;

  try {
    const companyFound = await Company.findById(companyId);

    if (!companyFound)
      return res.status(400).json({ message: "Company not found" });

    if (!companyFound.offers.includes(offerId)) {
      return res.status(400).json({ message: "Offer not found" });
    }

    companyFound.offers.pull(offerId);
    const companyUpdated = await companyFound.save();

    res.json({
      id: companyUpdated._id,
      name: companyUpdated.name,
      email: companyUpdated.email,
      location: companyUpdated.location,
      size: companyUpdated.size,
      website: companyUpdated.website,
      description: companyUpdated.description,
      logo: companyUpdated.logo,
      offers: companyUpdated.offers,
      createdAt: companyUpdated.createdAt,
      updatedAt: companyUpdated.updatedAt,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
