import express from "express";
import clientController from "../controllers/clientController.js";

const router = express.Router();

router.route("/")
  .get(clientController.getClients)
  .post(clientController.insertClients);

router.route("/:id")
  .put(clientController.updateClients)
  .delete(clientController.deleteClients);

export default router;