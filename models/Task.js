import mongoose from "mongoose";

const TaskSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, default: "" },
    position: { type: Number, default: 0 },
    priority: { 
        type: String, 
        enum: ["LOW", "MEDIUM", "HIGH", "CRITICAL"], 
        default: "LOW" 
    },
    dueDate: { type: Date, default: null },
    board: { type: mongoose.Schema.Types.ObjectId, ref: "Board", required: true },
    column: { type: mongoose.Schema.Types.ObjectId, ref: "Column", required: true },
    assignees: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    tasks: [{
        id: { type: String, required: true },
        content: { type: String, required: true },
        isCompleted: { type: Boolean, default: false }
    }],
    comments: [{
        id: { type: String, required: true },
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        content: { type: String, required: true },
        createdAt: { type: Date, default: Date.now }
    }]
}, { timestamps: true });

export default mongoose.model("Task", TaskSchema);