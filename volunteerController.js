// Import Firebase service functions
const { fetchVolunteerTasks, completeTask } = require('../services/firebaseService');

/**
 * @desc    Get all help requests assigned to the logged-in volunteer
 * @access  Protected: Volunteer only
 * @req     req.user.uid -> used to fetch tasks
 * @res     JSON array of assigned tasks
 */
async function getTasks(req, res) {
    try {
        const tasks = await fetchVolunteerTasks(req.user.uid);
        res.status(200).json(tasks);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
}

/**
 * @desc    Mark a specific task as complete
 * @access  Protected: Volunteer only
 * @req     req.params.id -> task (help request) ID
 * @res     Success message
 */
async function markTaskComplete(req, res) {
    try {
        const taskId = req.params.id;

        // Update task status in Firebase
        await completeTask(taskId);

        res.status(200).json({ message: "Task marked as complete" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
}

module.exports = { getTasks, markTaskComplete };
