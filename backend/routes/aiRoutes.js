import express from "express";
import { assistantChat } from "../controllers/aiController.js";

const router = express.Router();

router.post("/assistant", assistantChat);

export default router;
