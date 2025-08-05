import mongoose, { Document, Schema } from "mongoose";
import { RoleDocument } from "./roles-permission.model";

export interface MemberDocument extends Document {
    userId: mongoose.Types.ObjectId;
    workspaceId: mongoose.Types.ObjectId;
    joinedAt: Date;
    role : RoleDocument
}

const memberSchema = new Schema<MemberDocument>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        workspaceId: {
            type: Schema.Types.ObjectId,
            ref: "Workspace",
            required: true,
        },
        role: {
            type: String,
            required: true,
            ref: "Role",
        },

        joinedAt: {
            type: Date,
            default: Date.now,
        },
    },
    {
        timestamps: true,
    }
);

const MemberModel = mongoose.model<MemberDocument>("Member", memberSchema);
export default MemberModel; 