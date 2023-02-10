import express from "express";
import controller from "../controllers/ResetToken";
import { Schemas, ValidateSchema } from "../middleware/Joi";

const router = express.Router();

router.post(
    "/create",
    ValidateSchema(Schemas.resetToken.create),
    controller.createResetToken
);
router.get("/get/:userId", controller.readUserResetTokens);
router.get("/get/", controller.readAll);
router.delete("/delete/:resetTokenId", controller.deleteResetToken);

export default router;
