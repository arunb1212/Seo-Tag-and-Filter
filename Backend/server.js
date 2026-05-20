const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const apiRoutes = require('./routes/api');

dotenv.config();

const app = express();

app.use(cors({
  origin: [
    "https://seo-tag-and-filter.vercel.app",
    "http://localhost:5173",
    "http://localhost:5174",
  ]
}));
app.use(express.json());

connectDB();

app.use('/api', apiRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
