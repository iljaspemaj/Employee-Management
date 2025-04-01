const express = require("express");
const pool = require("../config/db");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

//Endpoint - get all users and their department (or show "Unemployeed")
router.get("/all-users", authMiddleware, async (req, res) => {
    try {
        const query = `
        SELECT 
        u.id AS user_id, 
        u.username AS user_name, 
        u.email, 
        u.status, 
        COALESCE(d.name, 'Unemployeed') AS department_name
    FROM users u
    LEFT JOIN user_departments ud ON u.id = ud.user_id
    LEFT JOIN departments d ON d.id = ud.department_id
    ORDER BY u.id ASC;
    `;
    
    const result = await pool.query(query);

    res.status(200).json(result.rows);
    } catch (error) {
        console.error("Error fetching users with departments:", error);
        res.status(500).json({ error: error.message });
    }
});

//Endpoint - get employees by department id

router.get("/department/:department_id", authMiddleware, async (req, res) => {
    const { department_id } = req.params;
    try {
        const query = `
        SELECT 
        u.id AS user_id, 
        u.username AS user_name, 
        u.email,
        d.name AS department_name
        FROM users u
        INNER JOIN user_departments ud ON u.id = ud.user_id
        INNER JOIN departments d ON d.id = ud.department_id
        WHERE d.id = $1
        ORDER BY u.id ;
        `;

        const result = await pool.query(query, [department_id]);

        if(result.rows.length === 0){
            return res.status(404).json({ 
                message: "No employees found for this specific department.", 
            });
        }

        res.status(200).json(result.rows);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
});

//Endpoint - update user department
router.put("/update-department", authMiddleware, async (req, res) => {
    const { user_id, department_id } = req.body;
    try {
        if(req.user.status !== "admin"){
            return res
            .status(403)
            .json({ message: "Access denied. Admins only" });
        }

        const departmentCheck = await pool.query(
            "SELECT id FROM departments WHERE id = $1",
            [department_id]
        );

        if (departmentCheck.rowCount === 0) {
            return res
            .status(404)
            .json({ message: "Department not found" });
        }

        const userCheck = await pool.query(
            "SELECT id FROM users WHERE id = $1",
            [user_id]
        );

        if (userCheck.rowCount === 0) {
            return res.status(404).json({ message: "User not found" });
        }
        
        const query = `
        INSERT INTO user_departments (user_id, department_id, created_at)
        VALUES ($1, $2, NOW())
        ON CONFLICT (user_id) DO UPDATE
        SET department_id = $2, created_at = NOW()
        RETURNING *; 
        `;

        const result = await pool.query(query, [user_id, department_id]);
        
        res.status(200).json({
            message: "Department updated successfully",
            data: result.rows[0],
        });
    } catch (error) {
        console.log(error);console.error("Error in /update-department:", error);
        res.status(500).json({ error: error.message });
    }
});

//Endpoint - update user status

router.put("/update-status", authMiddleware, async (req, res) => {
    const { user_id, status } = req.body;
    try {
        
        if(req.user.status !== "admin"){
            return res
           .status(404)
           .json({ message: "Access denied. Admins only" });
        }
        
        const allowedStatuses = ["admin", "employee"];
        
        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({ message: "Invalid status. Allowed values: admin or employee" });
        }

        const query = `
        UPDATE users
        SET status = $1, created_at = NOW()
        WHERE id = $2
        RETURNING id, username, status, email;
        `;

        const result = await pool.query(query, [status, user_id]);
        
        if(result.rowCount === 0){
            return res.status(404).json({ message: "User not found" });
        }
        
        res.status(200).json({
            message: "User status updated successfully",
            data: result.rows[0],
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;