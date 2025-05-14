import express from "express";
import passwordRevoceryController from "../controllers/passwordRecoveryController.js";

const router = express.Router();

router.route("/requestCode").post(passwordRevoceryController.requestCode);
router.route("/verifyCode").post(passwordRevoceryController.verifyCode);
router.route("/newPassword").post(passwordRevoceryController.newPassword);

export default router;