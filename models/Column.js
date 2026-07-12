import mongoose from "mongoose";

const ColumnSchema = new mongoose.Schema({
    title: { type: String, required: true },
    board: { type: mongoose.Schema.Types.ObjectId, ref: "Board", required: true },
    position: { type: Number, default: 0 },
    wipLimit: { type: Number, default: null }
}, { timestamps: true });

export default mongoose.model("Column", ColumnSchema);
