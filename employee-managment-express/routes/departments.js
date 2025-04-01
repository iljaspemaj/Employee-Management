const express = require("express");
const pool = require("../config/db");
const authMiddleware = require("../middlewares/authMiddleware");
const router = express.Router();

// Endpoint per krijimin e nje departamenti te ri

router.post("/", authMiddleware, async (req, res) => {
    const { name } = req.body;
    try {
        if(req.user.status !== "admin"){
            return res.status(403).json({ message: "Access denied. Admins only." });
        }

        const query = "INSERT INTO departments (name) VALUES ($1) RETURNING *";
        const result = await pool.query(query, [name]);
        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
});
    
// Endpoint - assign a user to a departament

router.post("/assign", authMiddleware, async (req, res) => {
    const { user_id, department_id } = req.body;
    try {
        if(req.user.status!== "admin"){
            return res.status(403).json({ message: "Access denied. Admins only." });
        }

        const query = "INSERT INTO user_departments (user_id, department_id) VALUES ($1, $2) RETURNING *";
        const result = await pool.query(query, [user_id, department_id]);
        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get("/", authMiddleware, async (req, res) =>{
    try {
        const query = `
        SELECT 
        d.id,
        d.name,
        COUNT(ud.user_id) AS employee_count
        FROM departments d
        LEFT JOIN user_departments ud ON d.id = ud.department_id
        GROUP BY d.id
        ORDER BY d.id
        `;
        const result = await pool.query(query);
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

//Endpoint Delete department

router.delete("/:id", authMiddleware, async (req, res) => {
    const { id } = req.params;

    try {
        if(req.user.status !== "admin"){
            return res
            .status(403)
            .json({ message: "Access denied. Admins only." });
        }

        await pool.query("DELETE FROM user_departments WHERE department_id = $1", [id]);
        const query = "DELETE FROM departments WHERE id = $1 RETURNING *";
        const result = await pool.query(query, [id]);

        if(result.rowCount === 0) {
            return res.status(404).json({ message: "Department not found" });
        }
        res.status(200).json({message: "Department deleted successfully."});
        
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Endpoint - get department by id
router.get("/:id", authMiddleware, async (req, res) => {
    const { id } = req.params;
    try {
        const query = `
        SELECT 
        d.id,
        d.name,
        COUNT(ud.user_id) AS employee_county
        FROM departments d
        LEFT JOIN user_departments ud ON d.id = ud.department_id
        WHERE d.id = $1
        GROUP BY d.id
        `;
        const result = await pool.query(query, [id]);
        
        if(!result.rows[0]){
            return res.status(404).json({ message: "Department not found" });
        }
        
        res.status(200).json(result.rows[0])
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Endpoint - update department by id
router.put("/:id", authMiddleware, async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;

    try {
        if(req.user.status!== "admin"){
            return res
            .status(403)
            .json({ message: "Access denied. Admins only." });
        }

        if(!name || name.length < 2){
            return res.status(400).json({ message: "Name is too short." });
        }

        const query = "UPDATE departments SET name = $1 WHERE id = $2 RETURNING *";
        const result = await pool.query(query, [name, id]);

        if(result.rowCount === 0){
            return res.status(404).json({ message: "Department not found" });
        }

        res.status(200).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


module.exports = router;