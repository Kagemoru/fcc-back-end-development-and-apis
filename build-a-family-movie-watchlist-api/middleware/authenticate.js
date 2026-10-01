import { isBlacklisted } from "../utils/token-blacklist.js";
import { verifyToken } from "../utils/jwt.js";

export function authenticate(req, res, next) {
    const authHeader = req.headers.authorization?.match(/^Bearer\s+(\S+)$/i);

    if (!authHeader) {
        return res.status(401).json({ error: "No token provided." });
    }

    const token = authHeader[1];
    const user = isBlacklisted(token) ? null : verifyToken(token);

    if (!user) {
        return res.status(401).json({ error: "Invalid or expired token." });
    }

    req.user = user;
    next();
}