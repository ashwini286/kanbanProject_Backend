import Users from "../models/Users.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const signup = async (email, password) => {
    // Strong password validation: min 8 chars, 1 uppercase, 1 lowercase, 1 digit, 1 special char
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    if (!passwordRegex.test(password)) {
        return { 
            status: 400, 
            message: "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character." 
        };
    }

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

    const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "1d" });
    return { status: 200, data: { token } };
};

export default { signup, login };