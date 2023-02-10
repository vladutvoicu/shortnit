import express from "express";
import controller from "../controllers/Url";
import { Schemas, ValidateSchema } from "../middleware/Joi";

const router = express.Router();

router.post(
    "/create",
    ValidateSchema(Schemas.url.create),
    controller.createUrl
);
router.get("/get/:userId", controller.readUserUrls);
router.get("/get/", controller.readAll);
router.patch(
    "/update/:urlId",
    ValidateSchema(Schemas.url.update),
    controller.updateUrl
);
router.delete("/delete/:urlId", controller.deleteUrl);

export default router;
