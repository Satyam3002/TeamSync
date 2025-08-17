import { Router } from "express";
import { createWorkspaceController, deleteWorkspaceByIdController, getWorkspaceAnalyticsController, getWorkspaceMembersController, updateWorkspaceByIdController } from "../controllers/workspace.controllers";
import { getAllWorkspacesUserIsMemberController } from "../controllers/workspace.controllers";
import { getWorkspaceByIdController } from "../controllers/workspace.controllers";
import { changeWorkspaceMemberRoleController } from "../controllers/workspace.controllers";

const workspaceRouter = Router();

workspaceRouter.post('/create/new',createWorkspaceController);
workspaceRouter.put("/update/:id",updateWorkspaceByIdController);
workspaceRouter.delete("/delete/:id",deleteWorkspaceByIdController);
workspaceRouter.put("/change/member/role/:id",changeWorkspaceMemberRoleController);
workspaceRouter.get('/all',getAllWorkspacesUserIsMemberController);
workspaceRouter.get("/members/:id",getWorkspaceMembersController);
workspaceRouter.get('/:id',getWorkspaceByIdController);
workspaceRouter.get('/analytics/:id',getWorkspaceAnalyticsController);
export default workspaceRouter;