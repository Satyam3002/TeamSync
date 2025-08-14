import WorkspaceModel from "../models/workspace.model";
import RoleModel from "../models/roles-permission.model";

import { NotFoundException } from "../utils/appError";
import UserModel from "../models/user.model";
import MemberModel from "../models/member.model";
import mongoose from "mongoose";

//*********************************************
//  Create Workspace Service
//*********************************************
export const createWorkspaceService = async (
    userId:string,
    body : {
        name:string,
        description?:string;
    }
) => {
    const {name,description} = body;
    const user = await UserModel.findById(userId);
    if(!user){
        throw new NotFoundException("User not found");
    }
         const ownerRole = await RoleModel.findOne({name:"OWNER"});
     if(!ownerRole){
        throw new NotFoundException("Owner role not found");
     }
     const workspace = await WorkspaceModel.create({
        name,
        description: description || undefined,
        owner:user._id,
     });
     await workspace.save();

     const member = await MemberModel.create({
        userId : user._id,
        workspaceId : workspace._id,
        role : ownerRole._id,
        joinedAt : new Date()
     });
     await member.save();

     user.currentWorkspace = workspace._id as mongoose.Types.ObjectId;
     await user.save();

     return {
        workspace,
     };

}

//*********************************************
//  Get All Workspaces User Is Member Service
//*********************************************
export const getAllWorkspacesUserIsMemberService = async (userId:string) => {
    const memberships = await MemberModel.find({userId})
    .populate("workspaceId")
    .select("-password")
    .exec();


    const workspaces = memberships.map((membership)=>membership.workspaceId);

    return {
        workspaces
    }
 
}

  
export const getWorkspaceByIdService = async (workspaceId:string) => {
 const workspace = await WorkspaceModel.findById(workspaceId);
 if(!workspace){
    throw new NotFoundException("Workspace not found");
 }

 const members = await MemberModel.find({
    workspaceId
 }).populate("role");

 const workspaceWithMembers = {
    ...workspace.toObject(),
    members,
 };

 
 return {
     workspace : workspaceWithMembers,
 }

}

   
