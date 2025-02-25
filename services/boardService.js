import Board from "../models/Board.js";
import Task from "../models/Task.js";

const createBoard = async (userId, name) => {
  const board = new Board({ name, user: userId });
  await board.save();
  return { status: 201, data: board };
};

const getBoards = async (userId) => {
  const boards = await Board.find({ user: userId });
  return { status: 200, data: boards };
};

const deleteBoard = async (userId, boardId) => {
  await Task.deleteMany({ board: boardId });
  await Board.findOneAndDelete({ _id: boardId, user: userId });
  return { status: 200, data: { message: "Board and its tasks deleted" } };
};

export default { createBoard, getBoards, deleteBoard };
