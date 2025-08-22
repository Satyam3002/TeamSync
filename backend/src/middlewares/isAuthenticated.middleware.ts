import { Request, Response, NextFunction } from "express";
import { UnauthorizedException } from "../utils/appError";

export const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
    console.log("isAuthenticated middleware - req.user:", req.user);
    console.log("isAuthenticated middleware - req.session:", req.session);
    console.log("isAuthenticated middleware - cookies:", req.headers.cookie);

    if(!req.user || !req.user._id) {
        throw new UnauthorizedException('Unauthorized. Please login to continue');
    }

    next();
}

