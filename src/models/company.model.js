import mongoose from "mongoose";

const companySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    location: {
      country: String,
      city: String,
    },
    size: {
      type: String,
      enum: [
        "1-10 employees",
        "11-50 employees",
        "51-200 employees",
        "201-500 employees",
        "501-1000 employees",
        "1001-5000 employees",
        "5001-10,000 employees",
        "10,001+ employees",
      ],
      required: true,
    },
    website: {
      type: String,
    },
    description: {
      type: String,
    },
    logo: {
      type: String,
    },
    offers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Offer",
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("Company", companySchema);
