import boardService from "../services/boardService.js";

export const createBoard = async (req, res) => {
    try {
        const response = await boardService.createBoard(req.user.id, req.body.name);
        res.status(response.status).json(response.data);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getBoards = async (req, res) => {
    try {
        const response = await boardService.getBoards(req.user.id);
        res.status(response.status).json(response.data);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const deleteBoard = async (req, res) => {
    try {
        const response = await boardService.deleteBoard(req.user.id, req.params.id);
        res.status(response.status).json(response.data);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};