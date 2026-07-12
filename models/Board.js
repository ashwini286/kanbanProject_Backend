import mongoose from "mongoose";

const BoardSchema = new mongoose.Schema({
    title: { type: String, required: true },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    backgroundSettings: {
        type: Map,
        of: String,
        default: () => new Map([
            ["type", "gradient"],
            ["value", "linear-gradient(135deg, #0f172a, #1e293b)"]
        ])
    }
}, { timestamps: true });

export default mongoose.model("Board", BoardSchema);