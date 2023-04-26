import express from "express";
import controller from "../controllers/ResetToken";
import { Schemas, ValidateSchema } from "../middleware/Joi";
import apiAuth from "../middleware/apiAuth";

const router = express.Router();

router.post(
    "/create",
    apiAuth,
    ValidateSchema(Schemas.resetToken.create),
    controller.createResetToken
);
router.get("/get/:userId", apiAuth, controller.readUserResetTokens);
router.get("/get/", apiAuth, controller.readAll);
router.delete("/delete/:resetTokenId", apiAuth, controller.deleteResetToken);

export default router;
