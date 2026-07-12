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
        const response = await taskService.getTasks(req.params.columnId);
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

export const reorderTasks = async (req, res) => {
    try {
        const response = await taskService.reorderTasks(req.body.tasks);
        res.status(response.status).json(response.data);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const addAttachment = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }
        const response = await taskService.addAttachment(req.params.id, req.file);
        res.status(response.status).json(response.data);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteAttachment = async (req, res) => {
    try {
        const response = await taskService.deleteAttachment(req.params.id, req.params.attachmentId);
        res.status(response.status).json(response.data);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};