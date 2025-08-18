
import { asyncHandler } from "../middlewares/asyncHandler.middleware";
import { Request,Response } from "express";
import { createProjectSchema, projectIdSchema } from "../validation/project.validarion";
import { workspaceIdSchema } from "../validation/workspace.validation";
import { getMemberRoleInWorkspace } from "../services/member.service";
import { roleGuard } from "../utils/roleGuard";
import { Permissions } from "../enums/role.enums";
import { createProjectService, getProjectByIdAndWorkspaceIdService, getProjectsInWorkspaceService } from "../services/project.service";
import { HTTP_CONFIG } from "../config/http.config";

export const createProjectController = asyncHandler(async(req:Request,res:Response)=>{
    const body = createProjectSchema.parse(req.body);
     const workspaceId = workspaceIdSchema.parse(req.params.workspaceId);

     const userId = req.user?._id;
     const {role} = await getMemberRoleInWorkspace(userId, workspaceId)
        roleGuard(role,[Permissions.CREATE_PROJECT]);

        const {project} =  await createProjectService(userId,workspaceId,{
            emoji:body.emoji || "",
            name:body.name,
            description:body.description || ""
        });

        res.status(201).json({
            success:true,
            message:"Project created successfully",
            project
        })
})

export const getAllProjectsController = asyncHandler(async(req:Request,res:Response)=>{
  const workspaceId = workspaceIdSchema.parse(req.params.workspaceId);
  const userId = req.user?._id;
  const {role} = await getMemberRoleInWorkspace(userId,workspaceId)
  roleGuard(role,[Permissions.VIEW_ONLY]);
   
  const pageSize = parseInt(req.query.pageSize as string) || 10;
  const pageNumber = parseInt(req.query.pageNumber as string) || 1;
  const {projects,totalPages,totalCount,skip,limit} = await getProjectsInWorkspaceService(
    workspaceId,
    pageSize,
    pageNumber,

  );

  return res.status(HTTP_CONFIG.OK).json({
    message:"Projects fetched successfully",
    projects,
    pagination:{
      totalPages,
      pageNumber,
      pageSize,
      totalCount,
      skip,
    }
  })

})

export const getProjectByIdAndWorkspaceIdController = asyncHandler(async(req:Request,res:Response)=>{
  const projectId = projectIdSchema.parse(req.params.projectId);
  const workspaceId = workspaceIdSchema.parse(req.params.workspaceId);
  
  const userId = req.user?._id;
  const {role} = await getMemberRoleInWorkspace(userId,workspaceId)
  roleGuard(role,[Permissions.VIEW_ONLY]);

  const {project} = await getProjectByIdAndWorkspaceIdService(projectId,workspaceId);
  
  
  




})