require("dotenv").config();
const Question = require("./models/Question");
const MockTest = require("./models/MockTest");
const TestResult = require("./models/TestResult");
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("./models/User");
const Company = require("./models/Company");
const Application = require("./models/Application");
const Resource = require("./models/Resource");
const Notification = require("./models/Notification");
const Resume = require("./models/Resume");
const Event = require("./models/Event");

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET;

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, "uploads/"),
    filename: (req, file, cb) =>
        cb(null, Date.now() + path.extname(file.originalname))
});

const upload = multer({ storage });

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB connected");
    } catch (error) {
        console.log("MongoDB connection failed:", error.message);
        process.exit(1);
    }
};

connectDB();

app.get("/", (req, res) => {
    res.send("Backend is working with MongoDB!");
});

// Register
app.post("/register", async (req, res) => {
    try {
        const {
            name,
            email,
            password,
            role,
            college,
            department,
            year,
            cgpa,
            skills
        } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User already exists with this email"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({
            name,
            email,
            password: hashedPassword,
            role: role || "student",
            college,
            department,
            year,
            cgpa,
            skills
        });

        await user.save();

        res.status(201).json({
            success: true,
            message: "User registered successfully",
            data: user
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Login
app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        const token = jwt.sign(
            { id: user._id, email: user.email },
            JWT_SECRET,
            { expiresIn: "1d" }
        );

        res.status(200).json({
            success: true,
            message: "Login successful",
            token,
            role: user.role,
            data: user
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// User Profile
app.put("/users/:id", async (req, res) => {
    try {
        delete req.body.password;

        const user = await User.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            data: user
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Companies
app.post("/companies", async (req, res) => {
    try {
        const company = new Company(req.body);
        await company.save();

        res.status(201).json({
            success: true,
            message: "Company added successfully",
            data: company
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

app.get("/companies", async (req, res) => {
    try {
        const companies = await Company.find();

        res.status(200).json({
            success: true,
            count: companies.length,
            data: companies
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

app.put("/companies/:id", async (req, res) => {
    try {
        const company = await Company.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        if (!company) {
            return res.status(404).json({
                success: false,
                message: "Company not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Company updated successfully",
            data: company
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

app.delete("/companies/:id", async (req, res) => {
    try {
        const company = await Company.findByIdAndDelete(req.params.id);

        if (!company) {
            return res.status(404).json({
                success: false,
                message: "Company not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Company deleted successfully"
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Applications
app.post("/applications", async (req, res) => {
    try {
        const application = new Application(req.body);
        await application.save();

        res.status(201).json({
            success: true,
            message: "Application submitted successfully",
            data: application
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

app.get("/applications", async (req, res) => {
    try {
        const applications = await Application.find()
            .populate("userId", "name email college department cgpa skills")
            .populate("companyId", "companyName role ctc eligibilityCgpa deadline location");

        res.status(200).json({
            success: true,
            count: applications.length,
            data: applications
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// My Applications
app.get("/my-applications/:userId", async (req, res) => {
    try {
        const applications = await Application.find({
            userId: req.params.userId
        })
            .populate("companyId", "companyName role ctc eligibilityCgpa deadline location")
            .populate("userId", "name email college department cgpa skills");

        res.status(200).json({
            success: true,
            count: applications.length,
            data: applications
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

app.put("/applications/:id", async (req, res) => {
    try {
        const application = await Application.findByIdAndUpdate(
            req.params.id,
            { status: req.body.status },
            { new: true }
        );

        if (!application) {
            return res.status(404).json({
                success: false,
                message: "Application not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Application status updated successfully",
            data: application
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Resources
app.post("/resources", async (req, res) => {
    try {
        const resource = new Resource(req.body);
        await resource.save();

        res.status(201).json({
            success: true,
            message: "Resource added successfully",
            data: resource
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

app.get("/resources", async (req, res) => {
    try {
        const resources = await Resource.find();

        res.status(200).json({
            success: true,
            count: resources.length,
            data: resources
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

app.put("/resources/:id", async (req, res) => {
    try {
        const resource = await Resource.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        if (!resource) {
            return res.status(404).json({
                success: false,
                message: "Resource not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Resource updated successfully",
            data: resource
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

app.delete("/resources/:id", async (req, res) => {
    try {
        const resource = await Resource.findByIdAndDelete(req.params.id);

        if (!resource) {
            return res.status(404).json({
                success: false,
                message: "Resource not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Resource deleted successfully"
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Notifications
app.post("/notifications", async (req, res) => {
    try {
        const notification = new Notification(req.body);
        await notification.save();

        res.status(201).json({
            success: true,
            message: "Notification added successfully",
            data: notification
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

app.get("/notifications", async (req, res) => {
    try {
        const notifications = await Notification.find();

        res.status(200).json({
            success: true,
            count: notifications.length,
            data: notifications
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

app.delete("/notifications/:id", async (req, res) => {
    try {
        const notification = await Notification.findByIdAndDelete(req.params.id);

        if (!notification) {
            return res.status(404).json({
                success: false,
                message: "Notification not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Notification deleted successfully"
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Resume Upload
app.post("/upload-resume", upload.single("resume"), async (req, res) => {
    try {
        const { userId } = req.body;

        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "Resume file is required"
            });
        }

        const resume = new Resume({
            userId,
            fileName: req.file.filename,
            filePath: req.file.path
        });

        await resume.save();

        res.status(201).json({
            success: true,
            message: "Resume uploaded successfully",
            data: resume
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

app.get("/resumes", async (req, res) => {
    try {
        const resumes = await Resume.find()
            .populate("userId", "name email college department");

        res.status(200).json({
            success: true,
            count: resumes.length,
            data: resumes
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Events
app.post("/events", async (req, res) => {
    try {
        const event = new Event(req.body);
        await event.save();

        res.status(201).json({
            success: true,
            message: "Event added successfully",
            data: event
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

app.get("/events", async (req, res) => {
    try {
        const events = await Event.find()
            .populate("companyId", "companyName role")
            .populate("userId", "name email");

        res.status(200).json({
            success: true,
            count: events.length,
            data: events
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

app.put("/events/:id", async (req, res) => {
    try {
        const event = await Event.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        if (!event) {
            return res.status(404).json({
                success: false,
                message: "Event not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Event updated successfully",
            data: event
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

app.delete("/events/:id", async (req, res) => {
    try {
        const event = await Event.findByIdAndDelete(req.params.id);

        if (!event) {
            return res.status(404).json({
                success: false,
                message: "Event not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Event deleted successfully"
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Dashboard
app.get("/dashboard", async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalCompanies = await Company.countDocuments();
        const totalApplications = await Application.countDocuments();
        const totalResources = await Resource.countDocuments();
        const totalNotifications = await Notification.countDocuments();
        const totalResumes = await Resume.countDocuments();
        const totalEvents = await Event.countDocuments();

        res.status(200).json({
            success: true,
            data: {
                totalUsers,
                totalCompanies,
                totalApplications,
                totalResources,
                totalNotifications,
                totalResumes,
                totalEvents
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Eligibility Checker
app.get("/eligibility/:userId/:companyId", async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);
        const company = await Company.findById(req.params.companyId);

        if (!user || !company) {
            return res.status(404).json({
                success: false,
                message: "User or Company not found"
            });
        }

        const eligible = user.cgpa >= company.eligibilityCgpa;

        res.status(200).json({
            success: true,
            user: user.name,
            company: company.companyName,
            userCgpa: user.cgpa,
            requiredCgpa: company.eligibilityCgpa,
            eligible,
            message: eligible
                ? "Student is eligible for this company"
                : "Student is not eligible for this company"
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});
// Get All Users
app.get("/users", async (req, res) => {
    try {
        const users = await User.find().select("-password");

        res.status(200).json({
            success: true,
            count: users.length,
            data: users
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});
// Question APIs

app.post("/questions", async (req, res) => {
    try {
        const question = new Question(req.body);
        await question.save();

        res.status(201).json({
            success: true,
            message: "Question added successfully",
            data: question
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

app.get("/questions", async (req, res) => {
    try {
        const questions = await Question.find();

        res.status(200).json({
            success: true,
            count: questions.length,
            data: questions
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

app.get("/questions/category/:category", async (req, res) => {
    try {
        const questions = await Question.find({
            category: req.params.category
        });

        res.status(200).json({
            success: true,
            count: questions.length,
            data: questions
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

app.put("/questions/:id", async (req, res) => {
    try {
        const question = await Question.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        if (!question) {
            return res.status(404).json({
                success: false,
                message: "Question not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Question updated successfully",
            data: question
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

app.delete("/questions/:id", async (req, res) => {
    try {
        const question = await Question.findByIdAndDelete(req.params.id);

        if (!question) {
            return res.status(404).json({
                success: false,
                message: "Question not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Question deleted successfully"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});
app.post("/mocktests", async (req, res) => {
    try {
        const mockTest = new MockTest(req.body);
        await mockTest.save();

        res.status(201).json({
            success: true,
            message: "Mock Test created successfully",
            data: mockTest
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});
app.get("/mocktests", async (req, res) => {
    try {
        const tests = await MockTest.find()
            .populate("questions");

        res.status(200).json({
            success: true,
            count: tests.length,
            data: tests
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});
app.get("/mocktests/:id", async (req, res) => {
    try {
        const test = await MockTest.findById(req.params.id)
            .populate("questions");

        if (!test) {
            return res.status(404).json({
                success: false,
                message: "Mock Test not found"
            });
        }

        res.status(200).json({
            success: true,
            data: test
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});
app.post("/test-results", async (req, res) => {
    try {
        const result = new TestResult(req.body);

        await result.save();

        res.status(201).json({
            success: true,
            message: "Test result saved successfully",
            data: result
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});
app.get("/test-results", async (req, res) => {
    try {
        const results = await TestResult.find()
            .populate("userId", "name email")
            .populate("mockTestId", "title category");

        res.status(200).json({
            success: true,
            count: results.length,
            data: results
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});
app.get("/test-results/:userId", async (req, res) => {
    try {
        const results = await TestResult.find({
            userId: req.params.userId
        })
            .populate("mockTestId", "title category");

        res.status(200).json({
            success: true,
            count: results.length,
            data: results
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

app.listen(5000, "0.0.0.0", () => {
  console.log("Server running on 5000");
});