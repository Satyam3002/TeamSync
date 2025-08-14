import { Router } from "express";
import { createWorkspaceController, getWorkspaceAnalyticsController, getWorkspaceMembersController } from "../controllers/workspace.controllers";
import { getAllWorkspacesUserIsMemberController } from "../controllers/workspace.controllers";
import { getWorkspaceByIdController } from "../controllers/workspace.controllers";

const workspaceRouter = Router();

workspaceRouter.post('/create/new',createWorkspaceController);
workspaceRouter.get('/all',getAllWorkspacesUserIsMemberController);
workspaceRouter.get("/members/:id",getWorkspaceMembersController);
workspaceRouter.get('/:id',getWorkspaceByIdController);
workspaceRouter.get('/analytics/:id',getWorkspaceAnalyticsController);
export default workspaceRouter;