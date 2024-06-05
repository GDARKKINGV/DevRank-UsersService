import mongoose from "mongoose";

const experienceSchema = new mongoose.Schema(
  {
    company: {
      type: String,
      required: true,
    },
    position: {
      type: String,
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
    },
    description: {
      type: String,
    },
  },
  {
    _id: false,
  }
);

const educationSchema = new mongoose.Schema(
  {
    institution: {
      type: String,
      required: true,
    },
    degree: {
      type: String,
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
    },
  },
  {
    _id: false,
  }
);

const skillSchema = new mongoose.Schema(
  {
    skill: {
      type: String,
      required: true,
    },
  },
  {
    _id: false,
  }
);

const socialLinkSchema = new mongoose.Schema(
  {
    plataform: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
  },
  {
    _id: false,
  }
);

const devSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    about: {
      type: String,
    },
    password: {
      type: String,
      required: true,
    },
    profileImage: {
      publicId: String,
      url: String,
    },
    points: {
      type: Number,
      default: 0,
    },
    experience: [experienceSchema],
    education: [educationSchema],
    skills: [skillSchema],
    socialLinks: [socialLinkSchema],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Developer", devSchema);
