import bcrypt from "bcryptjs";

import { userModel } from "../Models/user.js";



// Add a user
export async function addUser(req, res) {
    let { body } = req;
    if (!body.username || !body.password || !body.phone || !body.email)
        return res.status(400).json({ title: "Missing data in body", message: "Username, password, email, and phone are required" });

    try {
        let alreadyUser = await userModel.findOne({ username: body.username });
        if (alreadyUser)
            return res.status(409).json({ title: "Username already exists", message: "Please choose a different username" });

        // הצפנת הסיסמה
        const hashedPassword = await bcrypt.hash(body.password, 10);
        body.password = hashedPassword;

        let newUser = new userModel(body);
        await newUser.save();
        res.status(201).json(newUser);
    } catch (err) {
        res.status(400).json({ title: "Failed to add user", message: err.message });
    }
}

// Retrieve a user by code
export async function getUserByCode(req, res) {
    let { id } = req.params;
    try {
        let user = await userModel.findById(id).select('-password');
        if (!user)
            return res.status(404).json({ title: "User not found by id", message: `No user with such id ${id}` })
        res.status(200).json(user)
    }
    catch (err) {
        res.status(400).json({ title: "Failed to get user by code", message: err.message })

    }

}

// Retrieve all users
export async function getAllUsers(req, res) {
    try {
        const users = await userModel.find();
        res.status(200).json(users)
    }
    catch (err) {
        res.status(400).json({ title: "Failed to fetch all users", message: err.message })

    }
}

// Update user information except password
export async function updateUserInfo(req, res) {
    const { id } = req.params;
    const { userName, email, role, WebsiteRegistrationDate } = req.body;
    try {
        const user = await userModel.findById(id);
        if (!user) {
            return res.status(404).json({ title: "User not found", message: `No user with such id ${id}` })
        }

        if (userName) user.userName = userName;
        if (email) user.email = email;
        if (role) user.role = role;
        if (WebsiteRegistrationDate) user.WebsiteRegistrationDate = WebsiteRegistrationDate;

        await user.save();
        res.status(200).json(user);
    }
    catch (err) {
        res.status(400).json({ title: "Error updating user", message: err.message })

    }

}


// Update password
export async function updatePassword(req, res) {
    const { id } = req.params;
    const { oldPassword, newPassword } = req.body;

    try {
        const user = await userModel.findById(id);
        if (!user) {
            return res.status(404).json({ title: "User not found", message: `No user with such id ${id}` })
        }

        const match = await bcrypt.compare(oldPassword, user.password);
        if (!match) {
            return res.status(401).json({ title: "Incorrect password", message: "Old password is incorrect" });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;

        await user.save();
        res.status(200).json({ title: "Password updated successfully" });
    } catch (err) {
        res.status(400).json({ title: "Error updating password", message: err.message });
    }
}


// Login - Retrieve a user by name and password
export async function login(req, res) {
    const { username, password } = req.body;

    try {
        const user = await userModel.findOne({ username });
        if (!user) {
            return res.status(404).json({ title: "User not found", message: "Username or password is incorrect" });
        }

        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.status(401).json({ title: "Invalid credentials", message: "Username or password is incorrect" });
        }

        res.status(200).json({ title: "Login successful", user: { id: user._id, username: user.username, email: user.email } });
    } catch (err) {
        res.status(400).json({ title: "Error during login", message: err.message });
    }
}
