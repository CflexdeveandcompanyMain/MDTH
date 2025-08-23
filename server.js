require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const path = require('path');
const routes = require('./routes/routes');

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET;
const MONGODB_URI = process.env.MONGODB_URI ;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// User Schema
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true, trim: true, minlength: 3, maxlength: 50 },
  email: { type: String, required: true, unique: true, trim: true, lowercase: true },
  password: { type: String, required: true, minlength: 6 },
  fullName: { type: String, trim: true, maxlength: 100 },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  isActive: { type: Boolean, default: true },
  avatar: { type: String, default: '' },
  stats: {
    courses: { type: Number, default: 0 },
    hours: { type: Number, default: 0 },
    progress: { type: Number, default: 0 },
    certificates: { type: Number, default: 0 }
  }
}, { timestamps: true });

// Dashboard Schemas
const courseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  image: { type: String },
  totalModules: { type: Number, default: 0 },
  duration: { type: Number, default: 0 } // in hours
}, { timestamps: true });

const userCourseProgressSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  completedModules: { type: Number, default: 0 },
  progress: { type: Number, default: 0 }, // percentage
  lastAccessed: { type: Date, default: Date.now }
}, { timestamps: true });

const activitySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['video', 'assignment', 'achievement', 'forum', 'event'], required: true },
  title: { type: String, required: true },
  description: { type: String },
  time: { type: Date, default: Date.now }
}, { timestamps: true });

const deadlineSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['assignment', 'event'], required: true },
  title: { type: String, required: true },
  description: { type: String },
  dueDate: { type: Date, required: true }
}, { timestamps: true });

// Models
const User = mongoose.model('User', userSchema);
const Course = mongoose.model('Course', courseSchema);
const UserCourseProgress = mongoose.model('UserCourseProgress', userCourseProgressSchema);
const Activity = mongoose.model('Activity', activitySchema);
const Deadline = mongoose.model('Deadline', deadlineSchema);

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Connect to MongoDB
async function connectDB() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');
    
    // Create sample courses if they don't exist
    await createSampleCourses();
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
}

// Create sample courses
async function createSampleCourses() {
  const sampleCourses = [
    {
      title: "Web Development",
      description: "Learn full-stack web development",
      image: "images/program-1-image.png",
      totalModules: 12,
      duration: 40
    },
    {
      title: "Data Science Bootcamp",
      description: "Master data science techniques",
      image: "images/program-3-image.jpg",
      totalModules: 10,
      duration: 35
    },
    {
      title: "UI/UX Design Mastery",
      description: "Become a UI/UX design expert",
      image: "images/program-2-image.jpg",
      totalModules: 8,
      duration: 30
    }
  ];

  for (const courseData of sampleCourses) {
    const existingCourse = await Course.findOne({ title: courseData.title });
    if (!existingCourse) {
      const course = new Course(courseData);
      await course.save();
      console.log(`Created sample course: ${courseData.title}`);
    }
  }
}

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Access token required' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid or expired token' });
    req.user = user;
    next();
  });
};

// Helper functions for formatting
function formatDueDate(date) {
  const now = new Date();
  const dueDate = new Date(date);
  const diffTime = dueDate - now;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Tomorrow';
  if (diffDays < 7) return `In ${diffDays} days`;
  
  return dueDate.toLocaleDateString();
}

function formatActivityTime(date) {
  const now = new Date();
  const activityTime = new Date(date);
  const diffTime = now - activityTime;
  const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffHours < 1) return 'Just now';
  if (diffHours < 24) return `${diffHours} hours ago`;
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  
  return activityTime.toLocaleDateString();
}

// ================= API ROUTES =================

// Register
app.post('/api/register', async (req, res) => {
  try {
    const { username, email, password, fullName } = req.body;
    if (!username || !email || !password) return res.status(400).json({ error: 'Username, email, and password are required' });
    if (password.length < 6) return res.status(400).json({ error: 'Password must be at least 6 characters long' });

    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) return res.status(409).json({ error: 'Username or email already exists' });

    const user = new User({ 
      username, 
      email, 
      password, 
      fullName,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName || username)}&background=2563EB&color=fff`
    });
    await user.save();

    const token = jwt.sign({ userId: user._id, username: user.username, email: user.email }, JWT_SECRET, { expiresIn: '24h' });

    res.status(201).json({ 
      message: 'User registered successfully', 
      token, 
      user: { 
        id: user._id, 
        username: user.username, 
        email: user.email, 
        fullName: user.fullName, 
        role: user.role,
        avatar: user.avatar
      } 
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Login
app.post('/api/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ error: 'Username and password are required' });

    const user = await User.findOne({ $or: [{ username }, { email: username }], isActive: true });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) return res.status(401).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ userId: user._id, username: user.username, email: user.email }, JWT_SECRET, { expiresIn: '24h' });

    res.json({ 
      message: 'Login successful', 
      token, 
      user: { 
        id: user._id, 
        username: user.username, 
        email: user.email, 
        fullName: user.fullName, 
        role: user.role,
        avatar: user.avatar
      } 
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Verify Token
app.post('/api/verify-token', authenticateToken, (req, res) => {
  res.json({ valid: true, user: { userId: req.user.userId, username: req.user.username, email: req.user.email } });
});

// Profile (GET + UPDATE)
app.get('/api/profile', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ user });
  } catch (error) {
    console.error('Profile error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.put('/api/profile', authenticateToken, async (req, res) => {
  try {
    const { fullName, email } = req.body;
    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    if (email && email !== user.email) {
      const existingUser = await User.findOne({ email });
      if (existingUser) return res.status(409).json({ error: 'Email already exists' });
    }

    if (fullName) user.fullName = fullName;
    if (email) user.email = email;
    await user.save();

    res.json({ message: 'Profile updated successfully', user });
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get dashboard data
app.get('/api/dashboard', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    
    // Get user
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });
    
    // Get user's courses with progress
    const userCourses = await UserCourseProgress.find({ userId })
      .populate('courseId')
      .sort({ lastAccessed: -1 });
    
    // Format courses for response
    const courses = userCourses.map(uc => ({
      id: uc._id,
      title: uc.courseId.title,
      image: uc.courseId.image,
      completedModules: uc.completedModules,
      totalModules: uc.courseId.totalModules,
      progress: uc.progress
    }));
    
    // Get recent activities
    const activities = await Activity.find({ userId })
      .sort({ time: -1 })
      .limit(5)
      .select('type title description time');
    
    // Get upcoming deadlines
    const deadlines = await Deadline.find({ 
      userId, 
      dueDate: { $gte: new Date() } 
    })
      .sort({ dueDate: 1 })
      .limit(3)
      .select('type title description dueDate');
    
    // Calculate stats
    const totalCourses = userCourses.length;
    const totalHours = userCourses.reduce((sum, uc) => sum + (uc.courseId.duration * (uc.progress / 100)), 0);
    const avgProgress = userCourses.length > 0 
      ? userCourses.reduce((sum, uc) => sum + uc.progress, 0) / userCourses.length 
      : 0;
    const certificates = userCourses.filter(uc => uc.progress === 100).length;
    
    // Update user stats
    user.stats = {
      courses: totalCourses,
      hours: Math.round(totalHours),
      progress: Math.round(avgProgress),
      certificates: certificates
    };
    await user.save();
    
    res.json({
      user: {
        id: user._id,
        name: user.fullName || user.username,
        email: user.email,
        role: 'Student',
        avatar: user.avatar
      },
      stats: user.stats,
      courses: courses,
      upcoming: deadlines.map(d => ({
        type: d.type,
        title: d.title,
        description: d.description,
        dueDate: formatDueDate(d.dueDate)
      })),
      activities: activities.map(a => ({
        type: a.type,
        title: a.title,
        description: a.description,
        time: formatActivityTime(a.time)
      }))
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update course progress
app.put('/api/course-progress/:progressId', authenticateToken, async (req, res) => {
  try {
    const { progress } = req.body;
    const progressId = req.params.progressId;
    const userId = req.user.userId;
    
    const userProgress = await UserCourseProgress.findOne({ 
      _id: progressId, 
      userId 
    }).populate('courseId');
    
    if (!userProgress) {
      return res.status(404).json({ error: 'Progress record not found' });
    }
    
    // Update progress
    userProgress.progress = Math.min(100, Math.max(0, progress));
    userProgress.completedModules = Math.floor((userProgress.progress / 100) * userProgress.courseId.totalModules);
    userProgress.lastAccessed = new Date();
    
    await userProgress.save();
    
    // Create an activity record
    const activity = new Activity({
      userId,
      type: 'video',
      title: 'Progress updated',
      description: `${userProgress.courseId.title} - Now at ${userProgress.progress}% complete`,
      time: new Date()
    });
    await activity.save();
    
    // Return updated dashboard data
    const user = await User.findById(userId);
    const userCourses = await UserCourseProgress.find({ userId }).populate('courseId');
    
    // Calculate updated stats
    const totalCourses = userCourses.length;
    const totalHours = userCourses.reduce((sum, uc) => sum + (uc.courseId.duration * (uc.progress / 100)), 0);
    const avgProgress = userCourses.length > 0 
      ? userCourses.reduce((sum, uc) => sum + uc.progress, 0) / userCourses.length 
      : 0;
    const certificates = userCourses.filter(uc => uc.progress === 100).length;
    
    // Update user stats
    user.stats = {
      courses: totalCourses,
      hours: Math.round(totalHours),
      progress: Math.round(avgProgress),
      certificates: certificates
    };
    await user.save();
    
    res.json({
      user: {
        id: user._id,
        name: user.fullName || user.username,
        email: user.email,
        role: 'Student',
        avatar: user.avatar
      },
      stats: user.stats,
      courses: userCourses.map(uc => ({
        id: uc._id,
        title: uc.courseId.title,
        image: uc.courseId.image,
        completedModules: uc.completedModules,
        totalModules: uc.courseId.totalModules,
        progress: uc.progress
      }))
    });
  } catch (error) {
    console.error('Progress update error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create sample data for a user
app.post('/api/create-sample-data', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    
    // Get all sample courses
    const sampleCourses = await Course.find();
    
    // Delete existing user data
    await UserCourseProgress.deleteMany({ userId });
    await Activity.deleteMany({ userId });
    await Deadline.deleteMany({ userId });
    
    // Create progress records
    const progressRecords = [
      { courseId: sampleCourses[0]._id, progress: 67, completedModules: 8 },
      { courseId: sampleCourses[1]._id, progress: 50, completedModules: 5 },
      { courseId: sampleCourses[2]._id, progress: 38, completedModules: 3 }
    ];
    
    for (const record of progressRecords) {
      const userProgress = new UserCourseProgress({
        userId,
        courseId: record.courseId,
        progress: record.progress,
        completedModules: record.completedModules
      });
      await userProgress.save();
    }
    
    // Create sample activities
    const sampleActivities = [
      {
        type: "video",
        title: "Completed Video Lesson",
        description: "JavaScript Fundamentals - Module 2",
        time: new Date(Date.now() - 2 * 60 * 60 * 1000) // 2 hours ago
      },
      {
        type: "assignment",
        title: "Submitted Assignment",
        description: "HTML/CSS Portfolio Project",
        time: new Date(Date.now() - 24 * 60 * 60 * 1000) // 1 day ago
      },
      {
        type: "achievement",
        title: "Earned Achievement",
        description: "Code Explorer Badge",
        time: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) // 2 days ago
      }
    ];
    
    for (const activity of sampleActivities) {
      const newActivity = new Activity({
        userId,
        ...activity
      });
      await newActivity.save();
    }
    
    // Create sample deadlines
    const sampleDeadlines = [
      {
        type: "assignment",
        title: "Web Development Project",
        description: "Module 3 Assignment",
        dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000) // Tomorrow
      },
      {
        type: "event",
        title: "Live Q&A Session",
        description: "Data Science Bootcamp",
        dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000) // 3 days from now
      }
    ];
    
    for (const deadline of sampleDeadlines) {
      const newDeadline = new Deadline({
        userId,
        ...deadline
      });
      await newDeadline.save();
    }
    
    res.json({ message: 'Sample data created successfully' });
  } catch (error) {
    console.error('Sample data creation error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Admin: Get all users
app.get('/api/users', authenticateToken, async (req, res) => {
  const currentUser = await User.findById(req.user.userId);
  if (!currentUser || currentUser.role !== 'admin') return res.status(403).json({ error: 'Admin access required' });
  const users = await User.find({ isActive: true }).select('-password').sort({ createdAt: -1 });
  res.json({ users });
});

// Admin: Delete user (soft delete)
app.delete('/api/users/:id', authenticateToken, async (req, res) => {
  const currentUser = await User.findById(req.user.userId);
  if (!currentUser || currentUser.role !== 'admin') return res.status(403).json({ error: 'Admin access required' });
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ error: 'User not found' });
  user.isActive = false;
  await user.save();
  res.json({ message: 'User deleted successfully' });
});

// Use routes for serving HTML pages
app.use('/', routes);


// 404 handler
// 404 handler
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, 'public', 'views', '404.html'));
});

// Error handler
app.use((error, req, res, next) => {
  console.error('Server error:', error);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
async function startServer() {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`Visit: http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();