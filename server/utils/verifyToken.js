import jwt from "jsonwebtoken";

const verifyToken = (req, res, next) => {
    try {
        const authHeader = req.headers["authorization"];
        const token = authHeader && authHeader.split(" ")[1];

        if (!token) {
            return res.status(401).json({ message: "Access Denied. No token provided." });
        }

        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                return res.status(403).json({ message: "Invalid or expired token" });
            }

            req.user = decoded;
            next();
        });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

export default verifyToken;
