import taskService from "../services/taskService.js";

export const createTask = async (req, res) => {
    try {
        const response = await taskService.createTask(req.body);
        res.status(response.status).json(response.data);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getTasks = async (req, res) => {
    try {
        const response = await taskService.getTasks(req.params.boardId);
        res.status(response.status).json(response.data);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateTask = async (req, res) => {
    try {
        const response = await taskService.updateTask(req.params.id, req.body);
        res.status(response.status).json(response.data);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteTask = async (req, res) => {
    try {
        const response = await taskService.deleteTask(req.params.id);
        res.status(response.status).json(response.data);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};