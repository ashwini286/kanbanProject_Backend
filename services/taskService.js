import Task from "../models/Task.js";

const createTask = async (taskData) => {
    const task = new Task(taskData);
    await task.save();
    return { status: 201, data: task };
};

const getTasks = async (boardId) => {
    const tasks = await Task.find({ board: boardId }).sort({ position: 1 });
    return { status: 200, data: tasks };
};

const updateTask = async (taskId, updateData) => {
    const task = await Task.findByIdAndUpdate(taskId, updateData, { new: true });
    return { status: 200, data: task };
};

const deleteTask = async (taskId) => {
    await Task.findByIdAndDelete(taskId);
    return { status: 200, data: { message: "Task deleted" } };
};

const reorderTasks = async (tasksData) => {
    const bulkOps = tasksData.map(task => ({
        updateOne: {
            filter: { _id: task._id },
            update: { $set: { position: task.position, board: task.board } }
        }
    }));
    await Task.bulkWrite(bulkOps);
    return { status: 200, data: { message: "Tasks reordered successfully" } };
};

export default { createTask, getTasks, updateTask, deleteTask, reorderTasks };