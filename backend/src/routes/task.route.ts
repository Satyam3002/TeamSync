import { Router } from "express";
import { createTaskController } from "../controllers/task.controller";

const taskRoutes = Router();

taskRoutes.post("/:projectId/workspace/:workspaceId/create",createTaskController);
taskRoutes.put("/:taskId/workspace/:workspaceId/update",updateTaskController);
export default taskRoutes;