import Board from "../models/Board.js";
import Column from "../models/Column.js";
import Task from "../models/Task.js";

const createBoard = async (userId, title) => {
  // Create board
  const board = new Board({ title, owner: userId, members: [userId] });
  await board.save();

  // Auto-seed default columns
  const defaultCols = ["To Do", "In Progress", "Done"];
  const seededCols = await Promise.all(defaultCols.map((colTitle, index) => {
    const col = new Column({ title: colTitle, board: board._id, position: index });
    return col.save();
  }));

  return { 
    status: 201, 
    data: { 
      ...board.toObject(), 
      columns: seededCols.map(c => ({ ...c.toObject(), cards: [] })) 
    } 
  };
};

const getBoards = async (userId) => {
  // Get boards where user is owner or member
  const boards = await Board.find({
    $or: [{ owner: userId }, { members: userId }]
  }).sort({ position: 1 }).lean();
  return { status: 200, data: boards };
};

const getBoardDetails = async (userId, boardId) => {
  const board = await Board.findOne({
    _id: boardId,
    $or: [{ owner: userId }, { members: userId }]
  }).lean();

  if (!board) {
    return { status: 404, data: { message: "Board not found or unauthorized" } };
  }

  // Get columns sorted by position
  const columns = await Column.find({ board: boardId }).sort({ position: 1 }).lean();
  
  // Get tasks sorted by position
  const tasks = await Task.find({ board: boardId }).sort({ position: 1 })
    .populate("comments.user", "email")
    .populate("activities.user", "email")
    .lean();

  // Map tasks to their columns
  const columnsWithCards = columns.map(col => ({
    ...col,
    id: col._id.toString(),
    cards: tasks.filter(t => t.column.toString() === col._id.toString()).map(t => ({
      ...t,
      id: t._id.toString()
    }))
  }));

  return {
    status: 200,
    data: {
      ...board,
      id: board._id.toString(),
      columns: columnsWithCards
    }
  };
};

const updateBoard = async (userId, boardId, updateData) => {
  const board = await Board.findOneAndUpdate(
    { _id: boardId, owner: userId }, // only owner can change settings
    updateData,
    { new: true }
  );
  if (!board) return { status: 404, data: { message: "Board not found or unauthorized" } };
  return { status: 200, data: board };
};

const deleteBoard = async (userId, boardId) => {
  const board = await Board.findOneAndDelete({ _id: boardId, owner: userId });
  if (!board) return { status: 404, data: { message: "Board not found or unauthorized" } };

  // Cascade delete columns and tasks
  await Column.deleteMany({ board: boardId });
  await Task.deleteMany({ board: boardId });

  return { status: 200, data: { message: "Board and all its columns/tasks deleted successfully" } };
};

const reorderBoards = async (userId, orderedBoardIds) => {
  const bulkOps = orderedBoardIds.map((id, index) => ({
    updateOne: {
      filter: { _id: id, owner: userId },
      update: { $set: { position: index } }
    }
  }));

  if (bulkOps.length > 0) {
    await Board.bulkWrite(bulkOps);
  }

  return { status: 200, data: { message: "Boards reordered successfully" } };
};

export default { createBoard, getBoards, getBoardDetails, updateBoard, deleteBoard, reorderBoards };
