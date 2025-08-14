import { Router } from "express";
import { createWorkspaceController } from "../controllers/workspace.controllers";
import { getAllWorkspacesUserIsMemberController } from "../controllers/workspace.controllers";
import { getWorkspaceByIdController } from "../controllers/workspace.controllers";

const workspaceRouter = Router();

workspaceRouter.post('/create/new',createWorkspaceController);
workspaceRouter.get('/all',getAllWorkspacesUserIsMemberController);
workspaceRouter.get('/:id',getWorkspaceByIdController);

export default workspaceRouter;