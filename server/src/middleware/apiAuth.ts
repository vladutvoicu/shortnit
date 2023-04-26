import { NextFunction, Request, Response } from "express";
import { config } from "../config/config";

const apiAuth = (req: Request, res: Response, next: NextFunction) => {
    const apiKey = req.headers["Authorization"];
    if (!apiKey) {
        return res.status(401).json({ message: "API key missing" });
    }

    if (apiKey !== config.server.api_key) {
        return res.status(401).json({ message: "Invalid API key" });
    }

    next();
};

export default apiAuth;
