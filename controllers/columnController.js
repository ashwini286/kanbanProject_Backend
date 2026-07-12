import columnService from "../services/columnService.js";

export const createColumn = async (req, res) => {
    try {
        const { boardId, title, wipLimit } = req.body;
        const response = await columnService.createColumn(boardId, title, wipLimit);
        res.status(response.status).json(response.data);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateColumn = async (req, res) => {
    try {
        const response = await columnService.updateColumn(req.params.id, req.body);
        res.status(response.status).json(response.data);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteColumn = async (req, res) => {
    try {
        const response = await columnService.deleteColumn(req.params.id);
        res.status(response.status).json(response.data);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const reorderColumns = async (req, res) => {
    try {
        const response = await columnService.reorderColumns(req.body.columns);
        res.status(response.status).json(response.data);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
