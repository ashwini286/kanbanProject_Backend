import Task from "../models/Task.js";

const createTask = async (taskData) => {
    const task = new Task(taskData);
    await task.save();
    return { status: 201, data: task };
};

const getTasks = async (boardId) => {
    const tasks = await Task.find({ board: boardId });
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

export default { createTask, getTasks, updateTask, deleteTask };