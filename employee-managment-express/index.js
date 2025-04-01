const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const authRoutes = require("./routes/auth");
const departmentsRoutes = require("./routes/departments");
const employeesRoutes = require("./routes/employees")
const tasksRoutes = require("./routes/tasks");
const router = require("./routes/auth");

const app = express();

app.use(cors({origin: "http://localhost:5173"}));
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/departments", departmentsRoutes);
app.use("/api/employees", employeesRoutes);
app.use("/api", tasksRoutes);

const PORT = process.env.PORT || 8095;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});


module.exports = router;