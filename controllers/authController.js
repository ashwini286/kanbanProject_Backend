import authService from "../services/authService.js";

export const signup = async (req, res) => {
    try {
        const { email, password } = req.body;
        const response = await authService.signup(email, password);
        res.status(response.status).json({ message: response.message });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const response = await authService.login(email, password);
        res.status(response.status).json(response.data || { message: response.message });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const resetPassword = async (req, res) => {
    try {
        const { email, newPassword } = req.body;
        const response = await authService.resetPassword(email, newPassword);
        res.status(response.status).json({ message: response.message });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};