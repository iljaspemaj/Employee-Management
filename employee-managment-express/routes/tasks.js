const express = require("express");
const pool = require("../config/db");
const authMiddleware = require("../middlewares/authMiddleware");
const router = express.Router();

// Endpoint per te marr te gjithat taskat
router.get("/all-tasks", authMiddleware, async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM tasks");
        res.status(200).json(result.rows);
    } catch (error) {
        console.error("Error fetching tasks:", error);
        res.status(500).json({ error: "Failed to fetch tasks" });
    }
});

// Endpoint per te krijuar nje task
router.post("/tasks", authMiddleware, async (req, res) => {
    const { title, status, priority } = req.body;
    try {
        const result = await pool.query(
            "INSERT INTO tasks (title, status, priority) VALUES ($1, $2, $3) RETURNING *",
            [title, status, priority]
        );

        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error("Error creating task:", error);
        res.status(500).json({ error: "Failed to create task" });
    }
});


// Endpoint for updating a task
router.put("/tasks/:id", authMiddleware, async (req, res) => {
    const { id } = req.params;
    const { title, status, priority } = req.body;

    try {
        // Optional: Restrict updates to admins only
        if (req.user.status !== "admin") {
            return res.status(403).json({ error: "Access denied. Admins only." });
        }

        // Validate status and priority (optional)
        const validStatuses = ["in progress", "done", "canceled"];
        const validPriorities = ["low", "medium", "high"];

        if (status && !validStatuses.includes(status)) {
            return res.status(400).json({ error: "Invalid status value." });
        }

        if (priority && !validPriorities.includes(priority)) {
            return res.status(400).json({ error: "Invalid priority value." });
        }

        // Update the task
        const result = await pool.query(
            "UPDATE tasks SET title = $1, status = $2, priority = $3, updated_at = NOW() WHERE id = $4 RETURNING *",
            [title, status, priority, id]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ error: "Task not found" });
        }

        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error("Error updating task:", error);
        res.status(500).json({ error: "Failed to update task" });
    }
});

// Delete a task (admin only)
router.delete("/tasks/:id", authMiddleware, async (req, res) => {
    const { id } = req.params;

    try {
        if (req.user.status !== "admin") {
            return res.status(403).json({ error: "Access denied. Admins only." });
        }

        // Delete the task
        const deleteResult = await pool.query("DELETE FROM tasks WHERE id = $1 RETURNING *", [id]);

        if (deleteResult.rowCount === 0) {
            return res.status(404).json({ error: "Task not found" });
        }

        // Reorder the positions of the remaining tasks
        await pool.query(`
            WITH updated_tasks AS (
                SELECT id, ROW_NUMBER() OVER (ORDER BY position) AS new_position
                FROM tasks
            )
            UPDATE tasks
            SET position = updated_tasks.new_position
            FROM updated_tasks
            WHERE tasks.id = updated_tasks.id;
        `);

        res.status(200).json({ message: "Task deleted successfully and positions reordered" });
    } catch (error) {
        console.error("Error deleting task:", error);
        res.status(500).json({ error: "Failed to delete task" });
    }
});


module.exports = router;