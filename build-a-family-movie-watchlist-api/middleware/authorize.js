export function authorizeModification(req, res, next) {
    if (req.user.role === "parent") {
        return next();
    }

    if (req.user.role === "child" && Number(req.user.id) === Number(req.params.userId)) {
        return next();
    }

    return res.status(403).json({ error: "Access denied" });
}   