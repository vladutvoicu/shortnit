import express from "express";
import controller from "../controllers/Url";
import { Schemas, ValidateSchema } from "../middleware/Joi";
import apiAuth from "../middleware/apiAuth";

const router = express.Router();

router.post(
    "/create",
    apiAuth,
    ValidateSchema(Schemas.url.create),
    controller.createUrl
);
router.get("/get/:userId", apiAuth, controller.readUserUrls);
router.get("/get/", apiAuth, controller.readAll);
router.patch(
    "/update/:urlId",
    apiAuth,
    ValidateSchema(Schemas.url.update),
    controller.updateUrl
);
router.delete("/delete/:urlId", apiAuth, controller.deleteUrl);

export default router;
