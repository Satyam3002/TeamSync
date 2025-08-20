import { NextFunction, Request, Response } from "express";
import { asyncHandler } from "../middlewares/asyncHandler.middleware";
import { createTaskSchema } from "../validation/task.validation";
import { getMemberRoleInWorkspace } from "../services/member.service";
import { projectIdSchema } from "../validation/project.validarion";
import { workspaceIdSchema } from "../validation/workspace.validation";
import { roleGuard } from "../utils/roleGuard";
import { HTTP_CONFIG } from "../config/http.config";
import { Permissions } from "../enums/role.enums";
import { createTaskService } from "../services/task.service";

export const createTaskController = asyncHandler(async(req:Request,res:Response,next:NextFunction)=>{
 const body = createTaskSchema.parse(req.body);

    const projectId = projectIdSchema.parse(req.params.projectId);
    const workspaceId = workspaceIdSchema.parse(req.params.workspaceId);

    const userId = req.user?._id;

    const {role} = await getMemberRoleInWorkspace(userId,workspaceId)
    roleGuard(role,[Permissions.CREATE_TASK]);

    const {task} = await createTaskService(workspaceId, projectId, userId, body);

    return res.status(HTTP_CONFIG.OK).json({
        message:"Task created successfully",
        task
    })

})