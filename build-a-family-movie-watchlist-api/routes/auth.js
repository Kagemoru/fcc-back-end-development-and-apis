import { Router } from "express";
import bcrypt from "bcryptjs";
import { findByUsername } from "../utils/db.js";
import { signToken } from "../utils/jwt.js";

const router = Router();

router.post("/login", async (req, res) => {
    const { username, password } = req.body ?? {};

    if (!username || !password) {
        return res.status(400).json({ error: "Username and password are required." });
    }

    const user = findByUsername(username);

    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
        return res.status(401).json({ error: "Invalid username or password." });
    }

    const token = signToken({
        id: user.id,
        username: user.username,
        role: user.role,
    });

    return res.status(200).json({ token });
});

export default router;