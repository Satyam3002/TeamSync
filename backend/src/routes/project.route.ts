import { Router } from "express";
import { createProjectController, getProjectByIdAndWorkspaceIdController } from "../controllers/project.controller";
import { getAllProjectsController } from "../controllers/project.controller";

const projectRoutes = Router();

projectRoutes.post("/workspace/:workspaceId/create",createProjectController);
projectRoutes.get("/workspace/:workspaceId/getAll",getAllProjectsController);
projectRoutes.get("/:id/workspace/:workspaceId",getProjectByIdAndWorkspaceIdController);
export default projectRoutes;