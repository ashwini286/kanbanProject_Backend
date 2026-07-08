import mongoose from "mongoose";

const TaskSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: String,
    date: Date,
    position: { type: Number, default: 0 },
    board: { type: mongoose.Schema.Types.ObjectId, ref: "Board", required: true }
}, { timestamps: true });

export default mongoose.model("Task", TaskSchema);