const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
app.set('trust proxy', 1);

// Read the origins from the environment variable and split them into an array
// Fallback to localhost if the variable is missing (for local dev safety)
const allowedOrigins = process.env.CORS_ORIGINS 
  ? process.env.CORS_ORIGINS.split(',') 
  : ['http://localhost:3000'];

app.use(cors({
  origin: allowedOrigins,
  credentials: true // Keep this if your app uses cookies or sessions
}));
app.use(express.json());

// Import routes
const authRoutes = require('./routes/auth');
const aiRoutes = require('./routes/ai');
const resumeRoutes = require('./routes/resumes');

// Register routes
app.use('/api/auth', authRoutes);
app.use('/api', aiRoutes);
app.use('/api/resumes', resumeRoutes);

app.get('/', (req, res) => {
    res.send('AI Resume Builder API is running...');
});

app.listen(PORT, () => {
});
