import { Router } from "express";
import { createWorkspaceController } from "../controllers/workspace.controllers";

const workspaceRouter = Router();

workspaceRouter.post('/create/new',createWorkspaceController);

export default workspaceRouter;