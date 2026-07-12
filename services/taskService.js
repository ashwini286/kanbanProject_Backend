import Task from "../models/Task.js";
import fs from "fs";
import path from "path";

const createTask = async (taskData) => {
    // Count tasks in column to set position
    const count = await Task.countDocuments({ column: taskData.column });
    const task = new Task({ ...taskData, position: count });
    await task.save();
    return { status: 201, data: task };
};

const getTasks = async (columnId) => {
    const tasks = await Task.find({ column: columnId }).sort({ position: 1 }).lean();
    return { status: 200, data: tasks };
};

const updateTask = async (taskId, updateData) => {
    const task = await Task.findByIdAndUpdate(taskId, updateData, { new: true })
        .populate("comments.user", "email");
    if (!task) return { status: 404, data: { message: "Task not found" } };
    return { status: 200, data: task };
};

const deleteTask = async (taskId) => {
    const task = await Task.findByIdAndDelete(taskId);
    if (!task) return { status: 404, data: { message: "Task not found" } };
    return { status: 200, data: { message: "Task deleted successfully" } };
};

const reorderTasks = async (tasksData) => {
    const bulkOps = tasksData.map(task => ({
        updateOne: {
            filter: { _id: task._id },
            update: { $set: { position: task.position, column: task.column } }
        }
    }));
    await Task.bulkWrite(bulkOps);
    return { status: 200, data: { message: "Tasks reordered successfully" } };
};

const addAttachment = async (taskId, file) => {
    const task = await Task.findById(taskId);
    if (!task) return { status: 404, data: { message: "Task not found" } };

    const attachment = {
        id: Date.now() + Math.random().toString(36).substr(2, 9),
        name: file.originalname,
        url: `http://localhost:8000/uploads/${file.filename}`,
        fileType: file.mimetype,
        size: file.size,
        uploadedAt: new Date()
    };

    task.attachments.push(attachment);
    await task.save();

    const updatedTask = await Task.findById(taskId).populate("comments.user", "email");
    return { status: 200, data: updatedTask };
};

const deleteAttachment = async (taskId, attachmentId) => {
    const task = await Task.findById(taskId);
    if (!task) return { status: 404, data: { message: "Task not found" } };

    const attachment = task.attachments.find(att => att.id === attachmentId);
    if (!attachment) return { status: 404, data: { message: "Attachment not found" } };

    // Try deleting physical file
    const filename = attachment.url.split("/uploads/")[1];
    if (filename) {
        const filePath = path.join("./uploads", filename);
        if (fs.existsSync(filePath)) {
            try {
                fs.unlinkSync(filePath);
            } catch (err) {
                console.error("Error deleting local attachment file:", err);
            }
        }
    }

    task.attachments = task.attachments.filter(att => att.id !== attachmentId);
    await task.save();

    const updatedTask = await Task.findById(taskId).populate("comments.user", "email");
    return { status: 200, data: updatedTask };
};

export default { createTask, getTasks, updateTask, deleteTask, reorderTasks, addAttachment, deleteAttachment };