const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
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
    console.log(`Server is running on port ${PORT}`);
});
