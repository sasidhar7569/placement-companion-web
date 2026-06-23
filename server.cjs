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
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"]
  }
});
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET;

// Socket authentication middleware
io.use((socket, next) => {
  const token = socket.handshake.auth.token || socket.handshake.headers.token;
  if (!token) {
    return next(new Error("Authentication error: No token provided"));
  }
  
  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return next(new Error("Authentication error: Invalid token"));
    }
    socket.userId = decoded.id;
    next();
  });
});

io.on("connection", (socket) => {
  console.log(`User connected to socket: ${socket.userId}`);
  const userRoom = `user:${socket.userId}`;
  socket.join(userRoom);

  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.userId}`);
  });
});

// Helper to emit events to specific user room
const emitToUser = (userId, event, data) => {
  const userRoom = `user:${userId}`;
  io.to(userRoom).emit(event, data);
};

// HTTP JWT Authentication Middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  
  if (!token) {
    return res.status(401).json({ success: false, message: "No token provided" });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ success: false, message: "Invalid token" });
    }
    req.userId = decoded.id;
    next();
  });
};

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
app.get("/users/:id", async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select("-password");
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        res.status(200).json({ success: true, data: user });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

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

        // Broadcast to all sockets
        io.emit("notificationUpdated", notification);

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

        // Broadcast to all sockets
        io.emit("notificationUpdated", { deletedId: req.params.id });

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

        // Emit to user room
        emitToUser(result.userId, "resultUpdated", result);

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

// Mapping helpers
const mapBookmarksToClient = (bookmarks) => {
    return (bookmarks || []).map(b => ({
        id: b.itemId,
        title: b.title,
        category: b.type,
        date: b.createdAt ? new Date(b.createdAt).toLocaleDateString() : new Date().toLocaleDateString(),
        time: '15 mins'
    }));
};

const mapDailyTasksToClient = (dailyTasks) => {
    const dailyTasksMapped = {};
    (dailyTasks || []).forEach(t => {
        const parts = t.taskId.split('_');
        const day = parts[0];
        const id = parts.slice(1).join('_');
        if (!dailyTasksMapped[day]) dailyTasksMapped[day] = [];
        dailyTasksMapped[day].push({
            id: isNaN(Number(id)) ? id : Number(id),
            title: t.title,
            completed: t.completed,
            type: t.taskId.includes('schedule') ? 'Weekly Schedule Task Assigned' : 'Learning',
            duration: 'Custom',
            link: t.taskId.includes('schedule') ? '/home' : (id === '1' ? '/profile' : '/topic/1')
        });
    });
    return dailyTasksMapped;
};

const mapScheduleEventsToClient = (events) => {
    const scheduleEventsMapped = {};
    (events || []).forEach(e => {
        if (e.status) {
            scheduleEventsMapped[e.status] = e.title;
        }
    });
    return scheduleEventsMapped;
};

const mapPrepProgressToClient = (prepProgress) => {
    const prepCompletedMapped = {};
    (prepProgress || []).forEach(p => {
        prepCompletedMapped[p.topic] = p.completed;
    });
    return prepCompletedMapped;
};

const mapCodingProgressToClient = (codingProgress) => {
    const codingProgressMapped = {};
    (codingProgress || []).forEach(p => {
        codingProgressMapped[p.topic] = p.completed;
    });
    return codingProgressMapped;
};

// Real-Time Sync Endpoints
app.get("/api/sync/all", authenticateToken, async (req, res) => {
    try {
        const user = await User.findById(req.userId);
        if (!user) return res.status(404).json({ success: false, message: "User not found" });

        res.status(200).json({
            success: true,
            data: {
                profile: {
                    name: user.name,
                    email: user.email,
                    phone: user.phone || "",
                    profilePic: user.profilePic || "",
                    college: user.college || "",
                    department: user.department || "",
                    year: user.year || 1,
                    cgpa: user.cgpa || 0,
                    skills: user.skills || []
                },
                targetCompanies: user.targetCompanies || [],
                bookmarks: mapBookmarksToClient(user.bookmarks),
                prepCompleted: mapPrepProgressToClient(user.prepProgress),
                codingProgress: mapCodingProgressToClient(user.codingProgress),
                dailyTasks: mapDailyTasksToClient(user.dailyTasks),
                scheduleEvents: mapScheduleEventsToClient(user.scheduleEvents)
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

app.patch("/api/sync/tasks", authenticateToken, async (req, res) => {
    try {
        const { dailyTasks } = req.body;
        const tasksArray = [];
        if (dailyTasks) {
            Object.keys(dailyTasks).forEach(day => {
                if (Array.isArray(dailyTasks[day])) {
                    dailyTasks[day].forEach(t => {
                        tasksArray.push({
                            taskId: `${day}_${t.id}`,
                            title: t.title,
                            completed: !!t.completed,
                            completedAt: t.completed ? new Date() : null
                        });
                    });
                }
            });
        }

        const user = await User.findByIdAndUpdate(
            req.userId,
            { $set: { dailyTasks: tasksArray } },
            { new: true }
        );
        if (!user) return res.status(404).json({ success: false, message: "User not found" });

        const dailyTasksMapped = mapDailyTasksToClient(user.dailyTasks);
        emitToUser(req.userId, "taskUpdated", dailyTasksMapped);

        res.status(200).json({ success: true, data: dailyTasksMapped });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

app.patch("/api/sync/planner", authenticateToken, async (req, res) => {
    try {
        const { scheduleEvents } = req.body;
        const eventsArray = [];
        if (scheduleEvents) {
            Object.keys(scheduleEvents).forEach(day => {
                if (scheduleEvents[day]) {
                    eventsArray.push({
                        title: scheduleEvents[day],
                        status: day,
                        startDate: new Date(),
                        endDate: new Date()
                    });
                }
            });
        }

        const user = await User.findByIdAndUpdate(
            req.userId,
            { $set: { scheduleEvents: eventsArray } },
            { new: true }
        );
        if (!user) return res.status(404).json({ success: false, message: "User not found" });

        const scheduleEventsMapped = mapScheduleEventsToClient(user.scheduleEvents);
        emitToUser(req.userId, "plannerUpdated", scheduleEventsMapped);

        res.status(200).json({ success: true, data: scheduleEventsMapped });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

app.patch("/api/sync/profile", authenticateToken, async (req, res) => {
    try {
        const updates = req.body;
        const allowedFields = ["name", "phone", "profilePic", "college", "department", "year", "cgpa", "skills"];
        const updateQuery = {};
        Object.keys(updates).forEach(key => {
            if (allowedFields.includes(key)) {
                updateQuery[key] = updates[key];
            }
        });

        const user = await User.findByIdAndUpdate(
            req.userId,
            { $set: updateQuery },
            { new: true }
        );
        if (!user) return res.status(404).json({ success: false, message: "User not found" });

        const profileData = {
            name: user.name,
            email: user.email,
            phone: user.phone || "",
            profilePic: user.profilePic || "",
            college: user.college || "",
            department: user.department || "",
            year: user.year || 1,
            cgpa: user.cgpa || 0,
            skills: user.skills || []
        };

        emitToUser(req.userId, "profileUpdated", profileData);

        res.status(200).json({ success: true, data: profileData });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

app.patch("/api/sync/progress", authenticateToken, async (req, res) => {
    try {
        const { prepCompleted, codingProgress, targetCompanies } = req.body;
        const updateQuery = {};
        
        if (prepCompleted !== undefined) {
            const prepProgressArray = [];
            Object.keys(prepCompleted).forEach(topicId => {
                prepProgressArray.push({
                    category: topicId.startsWith('apt-') ? 'Aptitude' : 'General',
                    topic: topicId,
                    completed: !!prepCompleted[topicId],
                    completedAt: prepCompleted[topicId] ? new Date() : null
                });
            });
            updateQuery.prepProgress = prepProgressArray;
        }
        
        if (codingProgress !== undefined) {
            const codingProgressArray = [];
            Object.keys(codingProgress).forEach(topicId => {
                codingProgressArray.push({
                    category: 'Coding',
                    topic: topicId,
                    completed: !!codingProgress[topicId],
                    completedAt: codingProgress[topicId] ? new Date() : null
                });
            });
            updateQuery.codingProgress = codingProgressArray;
        }
        
        if (targetCompanies !== undefined) {
            updateQuery.targetCompanies = targetCompanies;
        }

        const user = await User.findByIdAndUpdate(
            req.userId,
            { $set: updateQuery },
            { new: true }
        );
        if (!user) return res.status(404).json({ success: false, message: "User not found" });

        const progressData = {
            prepCompleted: mapPrepProgressToClient(user.prepProgress),
            codingProgress: mapCodingProgressToClient(user.codingProgress),
            targetCompanies: user.targetCompanies
        };

        emitToUser(req.userId, "progressUpdated", progressData);

        res.status(200).json({ success: true, data: progressData });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

app.patch("/api/sync/bookmarks", authenticateToken, async (req, res) => {
    try {
        const { bookmarks } = req.body;
        const bookmarksArray = [];
        if (bookmarks) {
            bookmarks.forEach(b => {
                bookmarksArray.push({
                    type: b.category || 'General',
                    itemId: b.id,
                    title: b.title,
                    createdAt: b.date ? new Date(b.date) : new Date()
                });
            });
        }

        const user = await User.findByIdAndUpdate(
            req.userId,
            { $set: { bookmarks: bookmarksArray } },
            { new: true }
        );
        if (!user) return res.status(404).json({ success: false, message: "User not found" });

        const bookmarksMapped = mapBookmarksToClient(user.bookmarks);
        emitToUser(req.userId, "dataUpdated", { bookmarks: bookmarksMapped });

        res.status(200).json({ success: true, data: bookmarksMapped });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

server.listen(5000, "0.0.0.0", () => {
    console.log("Server running on 5000");
});