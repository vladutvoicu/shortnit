import Joi, { ObjectSchema } from "joi";
import { NextFunction, Response, Request } from "express";
import Logging from "../library/Logging";
import { IUser } from "../models/User";
import { IUrl } from "../models/Url";

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
            email: Joi.string().required(),
        }),
        update: Joi.object<IUser>({
            email: Joi.string().required(),
        }),
    },
    url: {
        create: Joi.object<IUrl>({
            user: Joi.string()
                .regex(/^[0-9a-fA-F]{24}$/)
                .required(),
            sourceUrl: Joi.string().required(),
            shortUrl: Joi.string().required(),
            alias: Joi.string().required(),
        }),
        update: Joi.object<IUrl>({
            user: Joi.string()
                .regex(/^[0-9a-fA-F]{24}$/)
                .required(),
            sourceUrl: Joi.string().required(),
            shortUrl: Joi.string().required(),
            alias: Joi.string().required(),
        }),
    },
};
