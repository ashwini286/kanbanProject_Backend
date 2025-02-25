import Users from "../models/Users.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const signup = async (email, password) => {
    const userExists = await Users.findOne({ email });
    if (userExists) return { status: 400, message: "User already exists" };

    const user = new Users({ email, password });
    await user.save();
    return { status: 201, message: "User registered successfully" };
};

const login = async (email, password) => {
    const user = await Users.findOne({ email });
    if (!user) return { status: 400, message: "Invalid credentials" };

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return { status: 400, message: "Invalid credentials" };

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });
    return { status: 200, data: { token } };
};

export default { signup, login };