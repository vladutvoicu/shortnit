import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import Url from "../models/Url";
import User from "../models/User";

const createUrl = (req: Request, res: Response, next: NextFunction) => {
    const { user, sourceUrl, alias, shortUrl } = req.body;

    const url = new Url({
        _id: new mongoose.Types.ObjectId(),
        user,
        sourceUrl,
        shortUrl,
        alias,
    });

    return User.findById(user)
        .then((user) =>
            user
                ? url
                      .save()
                      .then((url) => res.status(201).json({ url }))
                      .catch((error) => res.status(500).json({ error }))
                : res.status(404).json({ message: "User not found" })
        )
        .catch((error) => res.status(500).json({ error }));
};

const readUserUrls = (req: Request, res: Response, next: NextFunction) => {
    const userId = req.params.userId;

    return Url.find({ user: userId })
        .then((urls) => res.status(200).json({ urls }))
        .catch((error) => res.status(500).json({ error }));
};

const readAll = (req: Request, res: Response, next: NextFunction) => {
    return Url.find()
        .then((urls) => res.status(200).json({ urls }))
        .catch((error) => res.status(500).json({ error }));
};

const updateUrl = (req: Request, res: Response, next: NextFunction) => {
    const urlId = req.params.urlId;

    return Url.findById(urlId)
        .then((url) => {
            if (url) {
                url.set(req.body);

                return url
                    .save()
                    .then((url) => res.status(201).json({ url }))
                    .catch((error) => res.status(500).json({ error }));
            } else {
                res.status(404).json({ message: "Url not found" });
            }
        })
        .catch((error) => res.status(500).json({ error }));
};

const deleteUrl = (req: Request, res: Response, next: NextFunction) => {
    const urlId = req.params.urlId;

    return Url.findByIdAndDelete(urlId)
        .then((url) =>
            url
                ? res.status(201).json({ message: "Url deleted" })
                : res.status(404).json({ message: "Url not found" })
        )
        .catch((error) => res.status(500).json({ error }));
};

export default { createUrl, readUserUrls, readAll, updateUrl, deleteUrl };
