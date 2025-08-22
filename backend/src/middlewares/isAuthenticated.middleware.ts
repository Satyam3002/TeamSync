import { Request, Response, NextFunction } from "express";
import { UnauthorizedException } from "../utils/appError";
import jwt from "jsonwebtoken";
import config from "../config/app.config";
import UserModel from "../models/user.model";

export const isAuthenticated = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(' ')[1];
    
    console.log("isAuthenticated middleware - token:", token ? "present" : "missing");
    
    if (!token) {
        throw new UnauthorizedException('No token provided');
    }
    
    try {
        const decoded = jwt.verify(token, config.SESSION_SECRET) as any;
        console.log("isAuthenticated middleware - decoded token:", decoded);
        
        // Fetch user from database
        const user = await UserModel.findById(decoded.userId);
        if (!user) {
            throw new UnauthorizedException('User not found');
        }
        
        req.user = user;
        console.log("isAuthenticated middleware - user authenticated:", user.email);
        next();
    } catch (error) {
        console.log("isAuthenticated middleware - token verification failed:", error);
        throw new UnauthorizedException('Invalid token');
    }
}

