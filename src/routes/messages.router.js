import express from "express";
import messageController from "../controllers/message.contoller";

const messageRouter = express.Router();

// Maneja la solicitud para obtener los mensajes en tiempo real
messageRouter.get("/", messageController.getMessages);

// Maneja la solicitud para agregar mensajes en tiempo real
messageRouter.post("/addMessage", messageController.addMessage);

export default messageRouter;