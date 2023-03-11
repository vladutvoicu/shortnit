import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import ResetToken from "../models/ResetToken";
import User from "../models/User";
import { sendPasswordResetEmail } from "../middleware/Nodemailer";
import * as crypto from "crypto";

const createResetToken = (req: Request, res: Response, next: NextFunction) => {
    const { email } = req.body;
    var urlId = crypto.randomBytes(16).toString("hex");
    var user = "";

    const resetToken = new ResetToken({
        _id: new mongoose.Types.ObjectId(),
        email,
        user,
        urlId,
    });

    return User.find()
        .then((users) => {
            for (let i = 0; i < users.length; i++) {
                if (users[i]["email"] === email) {
                    ResetToken.find({ email: email })
                        .then((resetTokens) => {
                            if (resetTokens.length < 5) {
                                user = users[i]["_id"];
                                resetToken["user"] = String(user);
                                resetToken
                                    .save()
                                    .then((resetToken) => {
                                        sendPasswordResetEmail(email, urlId);
                                        res.status(201).json({ resetToken });
                                    })
                                    .catch((error) =>
                                        res.status(500).json({ error })
                                    );
                            } else {
                                res.status(403).json({
                                    message:
                                        "Too many reset requests, please wait 12 hours and try again",
                                });
                            }
                        })
                        .catch((error) => res.status(500).json({ error }));
                    break;
                } else {
                    if (i === users.length - 1) {
                        res.status(404).json({ message: "Email not found" });
                    }
                }
            }
        })
        .catch((error) => res.status(500).json({ error }));
};

const readUserResetTokens = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const userId = req.params.userId;

    return ResetToken.find({ user: userId })
        .then((resetTokens) => res.status(200).json({ resetTokens }))
        .catch((error) => res.status(500).json({ error }));
};

const readAll = (req: Request, res: Response, next: NextFunction) => {
    return ResetToken.find()
        .then((resetTokens) => res.status(200).json({ resetTokens }))
        .catch((error) => res.status(500).json({ error }));
};

const deleteResetToken = (req: Request, res: Response, next: NextFunction) => {
    const resetTokenId = req.params.resetTokenId;

    return ResetToken.findByIdAndDelete(resetTokenId)
        .then((resetToken) =>
            resetToken
                ? res.status(201).json({ message: "Reset token deleted" })
                : res.status(404).json({ message: "Reset token not found" })
        )
        .catch((error) => res.status(500).json({ error }));
};

export default {
    createResetToken,
    readUserResetTokens,
    readAll,
    deleteResetToken,
};
