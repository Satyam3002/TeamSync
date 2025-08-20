import { skip } from "node:test";
import ProjectModel from "../models/project.model"
import { NotFoundException } from "../utils/appError";
import TaskModel from "../models/task.model";
import mongoose from "mongoose";
import { TaskStatusEnum } from "../enums/task.enum";

export const createProjectService = async(userId:string,workspaceId:string,body:{
    emoji:string,
    name:string,
    description:string
})=>{
    const project = new ProjectModel({
        ...(body.emoji && {emoji:body.emoji}),
        name:body.name,
        description:body.description,
        workspace:workspaceId,
        createdBy:userId,
    })

    await project.save();

    return {project};
}

export const getProjectsInWorkspaceService = async(workspaceId:string,pageSize:number,pageNumber:number)=>{
    const totalCount = await ProjectModel.countDocuments({workspace:workspaceId});
    const skip = (pageNumber - 1) * pageSize;
    const projects = await ProjectModel.find({workspace:workspaceId})
    .skip(skip)
    .limit(pageSize)
    .populate("createdBy"," _id name profilePicture -password")
    .sort({createdAt:-1})

    const totalPages = Math.ceil(totalCount/pageSize);
    return {projects,totalPages,totalCount,skip,limit:pageSize};
    


}

export const getProjectByIdAndWorkspaceIdService = async(projectId:string,workspaceId:string)=>{
    const project = await ProjectModel.findOne({_id:projectId,workspace:workspaceId})
    .select("_id emoji name description");



    if(!project) {
        throw new NotFoundException("Project Not Found or not belongs to the workspace");
    }

    return {project};

}

export const getProjectAnalyticsService = async(projectId:string,workspaceId:string)=>{

    const project = await ProjectModel.findOne({_id:projectId,workspace:workspaceId})
     if(!project || project.workspace.toString() !== workspaceId){
        throw new NotFoundException("Project Not Found or not belongs to the workspace");
     }

     const currentDate = new Date();

     //USING Mongoose aggregate
     const taskAnalytics = await TaskModel.aggregate([
       {
         $match: {
           project: new mongoose.Types.ObjectId(projectId),
         },
       },
       {
         $facet: {
           totalTasks: [{ $count: "count" }],
           overdueTasks: [
             {
               $match: {
                 dueDate: { $lt: currentDate },
                 status: {
                   $ne: TaskStatusEnum.DONE,
                 },
               },
             },
             {
               $count: "count",
             },
           ],
           completedTasks: [
             {
               $match: {
                 status: TaskStatusEnum.DONE,
               },
             },
             { $count: "count" },
           ],
         },
       },
     ]);
   
     const _analytics = taskAnalytics[0];
   
     const analytics = {
       totalTasks: _analytics.totalTasks[0]?.count || 0,
       overdueTasks: _analytics.overdueTasks[0]?.count || 0,
       completedTasks: _analytics.completedTasks[0]?.count || 0,
     };
   
     return {
       analytics,
     };
   };

export const updateProjectService = async(projectId:string,workspaceId:string,body:{
    emoji:string,
    name:string,
    description:string
})=>{
  const {name,description,emoji} = body;

    const project = await ProjectModel.findOne({_id:projectId,workspace:workspaceId})

    if(!project){
        throw new NotFoundException("Project Not Found or not belongs to the workspace");
    }

   if(emoji) project.emoji = emoji;
   if(name) project.name = name;
   if(description) project.description = description;

    await project.save();

    return {project};


}


export const deleteProjectService = async(projectId:string,workspaceId:string)=>{
    const project = await ProjectModel.findOne({_id:projectId,workspace:workspaceId})

    if(!project){
        throw new NotFoundException("Project Not Found or not belongs to the workspace");
    }

    await project.deleteOne();

    return {project};
}
