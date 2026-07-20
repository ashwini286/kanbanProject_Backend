import Task from "../models/Task.js";
import Column from "../models/Column.js";
import fs from "fs";
import path from "path";

const createTask = async (taskData, userId) => {
    const count = await Task.countDocuments({ column: taskData.column });
    const task = new Task({ ...taskData, position: count });
    
    // Add CREATE activity
    if (userId) {
        task.activities.push({
            id: Date.now() + Math.random().toString(36).substr(2, 9),
            user: userId,
            actionType: "CREATE"
        });
    }

    await task.save();
    const populated = await Task.findById(task._id).populate("activities.user", "email");
    return { status: 201, data: populated };
};

const getTasks = async (columnId) => {
    const tasks = await Task.find({ column: columnId }).sort({ position: 1 }).lean();
    return { status: 200, data: tasks };
};

const updateTask = async (taskId, updateData, userId) => {
    const task = await Task.findById(taskId);
    if (!task) return { status: 404, data: { message: "Task not found" } };

    const newActivities = [];
    const actId = () => Date.now() + Math.random().toString(36).substr(2, 9);

    // 1. Title Changed
    if (updateData.title !== undefined && updateData.title !== task.title) {
        newActivities.push({
            id: actId(),
            user: userId,
            actionType: "EDIT_TITLE",
            details: { from: task.title, to: updateData.title }
        });
        task.title = updateData.title;
    }

    // 2. Description Changed
    if (updateData.description !== undefined && updateData.description !== task.description) {
        newActivities.push({
            id: actId(),
            user: userId,
            actionType: "EDIT_DESCRIPTION"
        });
        task.description = updateData.description;
    }

    // 3. Priority Changed
    if (updateData.priority !== undefined && updateData.priority !== task.priority) {
        newActivities.push({
            id: actId(),
            user: userId,
            actionType: "UPDATE_PRIORITY",
            details: { from: task.priority, to: updateData.priority }
        });
        task.priority = updateData.priority;
    }

    // 4. Due Date Changed
    const incomingDueDate = updateData.dueDate ? new Date(updateData.dueDate).toISOString() : null;
    const currentDueDate = task.dueDate ? new Date(task.dueDate).toISOString() : null;
    if (updateData.dueDate !== undefined && incomingDueDate !== currentDueDate) {
        newActivities.push({
            id: actId(),
            user: userId,
            actionType: "UPDATE_DUE_DATE",
            details: { 
                from: task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "None", 
                to: updateData.dueDate ? new Date(updateData.dueDate).toLocaleDateString() : "None" 
            }
        });
        task.dueDate = updateData.dueDate;
    }

    // 5. Checklist Items Added / Deleted / Toggled
    if (updateData.tasks !== undefined) {
        const oldTasks = task.tasks || [];
        const newTasks = updateData.tasks || [];

        // Check for additions/toggles
        newTasks.forEach(nt => {
            const match = oldTasks.find(ot => ot.id === nt.id);
            if (!match) {
                newActivities.push({
                    id: actId(),
                    user: userId,
                    actionType: "CHECKLIST_ADD",
                    details: { itemText: nt.content }
                });
            } else if (match.isCompleted !== nt.isCompleted) {
                newActivities.push({
                    id: actId(),
                    user: userId,
                    actionType: "CHECKLIST_TOGGLE",
                    details: { itemText: nt.content, to: nt.isCompleted ? "Completed" : "Incomplete" }
                });
            }
        });

        // Check for deletions
        oldTasks.forEach(ot => {
            const match = newTasks.find(nt => nt.id === ot.id);
            if (!match) {
                newActivities.push({
                    id: actId(),
                    user: userId,
                    actionType: "CHECKLIST_DELETE",
                    details: { itemText: ot.content }
                });
            }
        });

        task.tasks = updateData.tasks;
    }

    // 6. Comments Added
    if (updateData.comments !== undefined && updateData.comments.length > task.comments.length) {
        const addedComment = updateData.comments[updateData.comments.length - 1];
        newActivities.push({
            id: actId(),
            user: userId,
            actionType: "ADD_COMMENT",
            details: { itemText: addedComment.content }
        });
        task.comments = updateData.comments;
    } else if (updateData.comments !== undefined) {
        task.comments = updateData.comments;
    }

    if (updateData.assignees !== undefined) task.assignees = updateData.assignees;
    if (updateData.attachments !== undefined) task.attachments = updateData.attachments;

    if (newActivities.length > 0 && userId) {
        task.activities.push(...newActivities);
    }

    await task.save();

    const populated = await Task.findById(task._id)
        .populate("comments.user", "email")
        .populate("activities.user", "email");

    return { status: 200, data: populated };
};

const deleteTask = async (taskId) => {
    const task = await Task.findByIdAndDelete(taskId);
    if (!task) return { status: 404, data: { message: "Task not found" } };
    return { status: 200, data: { message: "Task deleted successfully" } };
};

const reorderTasks = async (tasksData, userId) => {
    // Find tasks whose columns are changing
    for (const update of tasksData) {
        const originalTask = await Task.findById(update._id);
        if (originalTask && originalTask.column.toString() !== update.column) {
            const oldCol = await Column.findById(originalTask.column);
            const newCol = await Column.findById(update.column);
            const oldColTitle = oldCol ? oldCol.title : "Unknown";
            const newColTitle = newCol ? newCol.title : "Unknown";
            
            const activity = {
                id: Date.now() + Math.random().toString(36).substr(2, 9),
                user: userId,
                actionType: "MOVE",
                details: { from: oldColTitle, to: newColTitle },
                createdAt: new Date()
            };
            
            await Task.findByIdAndUpdate(update._id, { 
                $push: { activities: activity } 
            });
        }
    }

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
        url: `/uploads/${file.filename}`,
        fileType: file.mimetype,
        size: file.size,
        uploadedAt: new Date()
    };

    task.attachments.push(attachment);
    await task.save();

    const updatedTask = await Task.findById(taskId)
        .populate("comments.user", "email")
        .populate("activities.user", "email");
    return { status: 200, data: updatedTask };
};

const deleteAttachment = async (taskId, attachmentId) => {
    const task = await Task.findById(taskId);
    if (!task) return { status: 404, data: { message: "Task not found" } };

    const attachment = task.attachments.find(att => att.id === attachmentId);
    if (!attachment) return { status: 404, data: { message: "Attachment not found" } };

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

    const updatedTask = await Task.findById(taskId)
        .populate("comments.user", "email")
        .populate("activities.user", "email");
    return { status: 200, data: updatedTask };
};

export default { createTask, getTasks, updateTask, deleteTask, reorderTasks, addAttachment, deleteAttachment };