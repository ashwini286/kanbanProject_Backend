import Task from "../models/Task.js";

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

export default { createTask, getTasks, updateTask, deleteTask, reorderTasks };