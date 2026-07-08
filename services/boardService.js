import Board from "../models/Board.js";
import Task from "../models/Task.js";

const createBoard = async (userId, name) => {
  const board = new Board({ name, user: userId });
  await board.save();
  return { status: 201, data: { ...board.toObject(), id: board._id, cards: [] } };
};

const getBoards = async (userId) => {
  const boards = await Board.find({ user: userId }).lean();
  const boardIds = boards.map(b => b._id);
  const tasks = await Task.find({ board: { $in: boardIds } }).sort({ position: 1 }).lean();

  const boardsWithTasks = boards.map(board => ({
    ...board,
    id: board._id,
    cards: tasks.filter(t => t.board.toString() === board._id.toString()).map(t => ({
      ...t,
      id: t._id
    }))
  }));

  return { status: 200, data: boardsWithTasks };
};

const deleteBoard = async (userId, boardId) => {
  await Task.deleteMany({ board: boardId });
  await Board.findOneAndDelete({ _id: boardId, user: userId });
  return { status: 200, data: { message: "Board and its tasks deleted" } };
};

export default { createBoard, getBoards, deleteBoard };
