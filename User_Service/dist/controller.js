import { TryCatch } from "./TryCatch.js";
import { User } from "./model.js";
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";
export const registerUser = TryCatch(async (req, res) => {
    const { name, email, password } = req.body;
    let user = await User.findOne({ email });
    if (user) {
        res.status(400).json({
            message: "User Already exists",
        });
        return;
    }
    4;
    if (!password) {
        return res.status(400).json({ message: "Password required" });
    }
    if (!email) {
        return res.status(400).json({ message: "email required" });
    }
    const hashPassword = await bcrypt.hash(password, 10);
    user = await User.create({
        name,
        email,
        password: hashPassword,
    });
    // creating a secure JWT token
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
    res.status(201).json({
        message: "User Registered",
        user,
        token,
    });
});
export const loginUser = TryCatch(async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
        res.status(404).json({
            message: "User not exists",
        });
        return;
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        res.status(404).json({
            message: "Invalid password",
        });
        return;
    }
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
    res.status(201).json({
        message: "Logged In",
        user,
        token,
    });
});
export const myProfile = TryCatch(async (req, res) => {
    const user = req.user;
    res.json(user);
});
//# sourceMappingURL=controller.js.map