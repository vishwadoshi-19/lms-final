const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
// import path from "path";
require("dotenv").config();

const app = express();
// Connect Database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/books", require("./routes/books"));

//deployment code

// if(process.env.NODE_ENV === 'production'){

// }


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
