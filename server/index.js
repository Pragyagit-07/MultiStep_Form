const express = require("express");
const cors = require("cors");
const multer = require("multer");
const bodyParser = require("body-parser");
const app = express();
const PORT = process.env.PORT || 5000;
require("dotenv").config();
const mongoose = require("mongoose");
const User = require("./models/User");


// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log(" Connected to MongoDB Atlas"))
.catch((err) => console.error("MongoDB connection error:", err));
// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.static('uploads'));

// Storage config for multer (for profile photo)
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
  fileFilter: function (req, file, cb) {
    const allowedTypes = ["image/jpeg", "image/png"];
    if (!allowedTypes.includes(file.mimetype)) {
      return cb(new Error("Only JPG and PNG allowed"));
    }
    cb(null, true);
  },
});




// Upload profile photo and save other data

 app.post("/api/profile", upload.single("profilePhoto"), async (req, res) => {
  const {
    username,
    profession,
    companyName,
    address1,
    country,
    state,
    city,
    plan,
    newsletter
  } = req.body;

  const file = req.file;

  if (!file) {
    return res.status(400).json({ error: "Profile photo is required" });
  }

  try {
    const user = new User({
      username,
      profession,
      companyName,
      addressLine1: address1,
      country,
      state,
      city,
      plan,
      newsletter: newsletter === "true", // Convert from string to boolean
      profilePhoto: file.filename
    });

    await user.save();

    res.status(200).json({ message: "Profile saved to database!" });
  } catch (error) {
    console.error("Error saving user:", error);
    res.status(500).json({ error: "Failed to save profile." });
  }
});
app.get("/api/check-username", async (req, res) => {
  const { username } = req.query;

  if (!username) return res.status(400).json({ available: false, error: "Username required" });

  try {
    const existing = await User.findOne({ username });
    res.json({ available: !existing });
  } catch (err) {
    console.error("Error checking username:", err);
    res.status(500).json({ available: false, error: "Server error" });
  }
});


// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
