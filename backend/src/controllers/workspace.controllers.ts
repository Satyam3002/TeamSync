import { Request, Response } from "express";
import { asyncHandler } from "../middlewares/asyncHandler.middleware";
import { createWorkspaceSchema, workspaceIdSchema } from "../validation/workspace.validation";
import { HTTP_CONFIG } from "../config/http.config";
import { createWorkspaceService, getWorkspaceAnalyticsService, getWorkspaceByIdService, getWorkspaceMembersService } from "../services/workspace.service";
import { NotFoundException } from "../utils/appError";
import { getAllWorkspacesUserIsMemberService } from "../services/workspace.service";
import { getMemberRoleInWorkspace } from "../services/member.service";
import { Permissions } from "../enums/role.enums";
import { roleGuard } from "../utils/roleGuard";

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

export const getWorkspaceMembersController = asyncHandler(
    async (req:Request,res:Response)=>{
        const WorkspaceId = workspaceIdSchema.parse(req.params.id);
        const userId = req.user?._id;
         

        const {role} = await getMemberRoleInWorkspace(userId,WorkspaceId);
         roleGuard(role,[Permissions.VIEW_ONLY])

         const {members, roles } = await getWorkspaceMembersService(WorkspaceId);

         return res.status(HTTP_CONFIG.OK).json({
            message : "Workspace members fetched successfully",
            data : {
                members,
                roles
            }
         })


    }
)

export const getWorkspaceAnalyticsController = asyncHandler(
    async (req:Request,res:Response)=>{
        const WorkspaceId = workspaceIdSchema.parse(req.params.id);
        const userId = req.user?._id;
        const {role} = await getMemberRoleInWorkspace(userId,WorkspaceId)
        roleGuard(role,[Permissions.VIEW_ONLY])

        const {analytics} = await getWorkspaceAnalyticsService(WorkspaceId);

        return res.status(HTTP_CONFIG.OK).json({
            message : "Workspace analytics fetched successfully",
            data : analytics
        })
    }
)