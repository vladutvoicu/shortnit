import Joi, { ObjectSchema } from "joi";
import { NextFunction, Response, Request } from "express";
import Logging from "../library/Logging";
import { IUser } from "../models/User";
import { IUrl } from "../models/Url";
import { IResetToken } from "../models/ResetToken";

const emailRegex =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const passwordRegex = /^.{8,}$/;
const urlRegex =
    /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z0-9\u00a1-\uffff][a-z0-9\u00a1-\uffff_-]{0,62})?[a-z0-9\u00a1-\uffff]\.)+(?:[a-z\u00a1-\uffff]{2,}\.?))(?::\d{2,5})?(?:[/?#]\S*)?$/i;

export const ValidateSchema = (schema: ObjectSchema) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            await schema.validateAsync(req.body);

            next();
        } catch (error) {
            Logging.error(error);
            return res.status(422).json({ error });
        }
    };
};

export const Schemas = {
    user: {
        create: Joi.object<IUser>({
            email: Joi.string().regex(emailRegex).required(),
            password: Joi.string().regex(passwordRegex).required(),
        }),
        update: Joi.object<IUser>({
            email: Joi.string().required(),
            password: Joi.string().regex(passwordRegex).required(),
        }),
    },
    url: {
        create: Joi.object<IUrl>({
            user: Joi.string()
                .regex(/^[0-9a-fA-F]{24}$/)
                .required(),
            sourceUrl: Joi.string().regex(urlRegex).required(),
            shortUrl: Joi.string().regex(urlRegex).required(),
            alias: Joi.string().required(),
            redirectData: Joi.object({
                users: Joi.array()
                    .items(
                        Joi.object({
                            ip: Joi.string().required(),
                            countryName: Joi.string().required(),
                            continentCode: Joi.string().required(),
                            totalClicks: Joi.number().required(),
                        })
                    )
                    .required(),
                uniqueClicks: Joi.number().required(),
                mobileUsers: Joi.number().required(),
                desktopUsers: Joi.number().required(),
            }).required(),
        }),
        update: Joi.object<IUrl>({
            user: Joi.string()
                .regex(/^[0-9a-fA-F]{24}$/)
                .required(),
            sourceUrl: Joi.string().regex(urlRegex).required(),
            shortUrl: Joi.string().regex(urlRegex).required(),
            alias: Joi.string().required(),
            redirectData: Joi.object({
                users: Joi.array()
                    .items(
                        Joi.object({
                            ip: Joi.string().required(),
                            countryName: Joi.string().required(),
                            continentCode: Joi.string().required(),
                            totalClicks: Joi.number().required(),
                        })
                    )
                    .required(),
                uniqueClicks: Joi.number().required(),
                mobileUsers: Joi.number().required(),
                desktopUsers: Joi.number().required(),
            }).required(),
        }),
    },
    resetToken: {
        create: Joi.object<IResetToken>({
            user: Joi.string()
                .regex(/^[0-9a-fA-F]{24}$/)
                .required(),
        }),
    },
};
