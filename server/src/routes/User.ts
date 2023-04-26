import express from "express";
import controller from "../controllers/User";
import { Schemas, ValidateSchema } from "../middleware/Joi";
import apiAuth from "../middleware/apiAuth";

const router = express.Router();

router.post(
    "/create",
    apiAuth,
    ValidateSchema(Schemas.user.create),
    controller.createUser
);
router.get("/get/:userId", apiAuth, controller.readUser);
router.get("/get/", apiAuth, controller.readAll);
router.patch(
    "/update/:userId",
    apiAuth,
    ValidateSchema(Schemas.user.update),
    controller.updateUser
);
router.delete("/delete/:userId", apiAuth, controller.deleteUser);

export default router;
