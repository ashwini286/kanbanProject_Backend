import Column from "../models/Column.js";
import Task from "../models/Task.js";

const createColumn = async (boardId, title, wipLimit = null) => {
    // Count columns to find position
    const count = await Column.countDocuments({ board: boardId });
    const column = new Column({ title, board: boardId, position: count, wipLimit });
    await column.save();
    return { status: 201, data: column };
};

const updateColumn = async (columnId, updateData) => {
    const column = await Column.findByIdAndUpdate(columnId, updateData, { new: true });
    if (!column) return { status: 404, data: { message: "Column not found" } };
    return { status: 200, data: column };
};

const deleteColumn = async (columnId) => {
    const column = await Column.findByIdAndDelete(columnId);
    if (!column) return { status: 404, data: { message: "Column not found" } };

    // Cascade delete tasks in this column
    await Task.deleteMany({ column: columnId });

    return { status: 200, data: { message: "Column and its tasks deleted" } };
};

const reorderColumns = async (columnsData) => {
    const bulkOps = columnsData.map(col => ({
        updateOne: {
            filter: { _id: col._id },
            update: { $set: { position: col.position } }
        }
    }));
    await Column.bulkWrite(bulkOps);
    return { status: 200, data: { message: "Columns reordered successfully" } };
};

export default { createColumn, updateColumn, deleteColumn, reorderColumns };
