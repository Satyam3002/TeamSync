import { Request, Response } from "express";
import { asyncHandler } from "../middlewares/asyncHandler.middleware";
import { createWorkspaceSchema, workspaceIdSchema } from "../validation/workspace.validation";
import { HTTP_CONFIG } from "../config/http.config";
import { createWorkspaceService, getWorkspaceByIdService } from "../services/workspace.service";
import { NotFoundException } from "../utils/appError";
import { getAllWorkspacesUserIsMemberService } from "../services/workspace.service";
import { getMemberRoleInWorkspace } from "../services/member.service";

export const createWorkspaceController = asyncHandler(
    async (req:Request,res:Response)=>{
        const body = createWorkspaceSchema.parse(req.body);

        const userId = req.user?._id;
        const {workspace} = await createWorkspaceService(userId, body);

        return res.status(HTTP_CONFIG.CREATED).json({
            message : "Workspace created successfully",
            data : workspace
        });


    }
)

export const getAllWorkspacesUserIsMemberController = asyncHandler(
    async (req:Request,res:Response)=>{
        const userId = req.user?._id;
        if(!userId){
            throw new NotFoundException("User not found");
        }
        const {workspaces} = await getAllWorkspacesUserIsMemberService(userId);
        return res.status(HTTP_CONFIG.OK).json({
            message : "Workspaces fetched successfully",
            data : workspaces
        });
    }
)
export const getWorkspaceByIdController = asyncHandler(
    async (req:Request,res:Response)=>{
        const WorkspaceId = workspaceIdSchema.parse(req.params.id);
        const userId = req.user?._id;

        // Check if user is a member of this workspace
        await getMemberRoleInWorkspace(userId,WorkspaceId);
        
        // Get workspace details
        const {workspace} = await getWorkspaceByIdService(WorkspaceId);

        return res.status(HTTP_CONFIG.OK).json({
            message: "Workspace fetched successfully",
            data: workspace
        });
    }
)