import WorkspaceModel from "../models/workspace.model";
import RoleModel from "../models/roles-permission.model";

import { NotFoundException } from "../utils/appError";
import UserModel from "../models/user.model";
import MemberModel from "../models/member.model";
import mongoose from "mongoose";

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
    const ownerRole = await RoleModel.findOne({name:"owner"});
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
  

   
