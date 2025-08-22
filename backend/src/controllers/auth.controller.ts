import { NextFunction, Request, Response } from "express";
import  {asyncHandler} from "../middlewares/asyncHandler.middleware";
import { getEnv } from "../utils/get-env";
import { registerSchema } from "../validation/auth.validation";
import { registerUserService } from "../services/auth.service";
import { HTTP_CONFIG } from "../config/http.config";
import passport from "passport";


export const googleLoginCallback = asyncHandler(async (req: Request, res: Response) => {
  const currentWorkspace = req.user?.currentWorkspace;
  if(!currentWorkspace){
    return res.redirect(`${getEnv("FRONTEND_GOOGLE_CALLBACK_URL")}?status=failure`);
}
   return res.redirect(`${getEnv("FRONTEND_ORIGIN")}/workspace/${currentWorkspace}`);
});


export const registerUserController = asyncHandler(async (req: Request, res: Response) => {
const body = registerSchema.parse(req.body);

await registerUserService(body);

return res.status(HTTP_CONFIG.CREATED).json({
    message: "User registered successfully",
})



})

export const loginUserController = asyncHandler(async (req: Request, res: Response,next: NextFunction) => {
    passport.authenticate("local", (err: Error | null, user: Express.User | false, info: {message: string}) => {
        if(err){
            return next(err);
        }
        if(!user){
            return res.status(HTTP_CONFIG.UNAUTHORIZED).json({
                message: info.message,
            });
        }
        req.logIn(user, (err) => {
            if(err){
                return next(err);
            }
            
            // Debug: Check if session is being saved
            console.log("Login successful - Session before save:", req.session);
            console.log("Login successful - User:", user);
            
            // Force session save
            req.session.save((err) => {
                if (err) {
                    console.error("Session save error:", err);
                } else {
                    console.log("Session saved successfully");
                }
                
                return res.status(HTTP_CONFIG.OK).json({
                    message: "Login successful",
                    user,
                });
            });
        });
    })(req, res, next);
});


export const logoutUserController = asyncHandler(
    async (req: Request, res: Response) => {
      req.logout((err) => {
        if (err) {
          console.error("Logout error:", err);
          return res
            .status(HTTP_CONFIG.INTERNAL_SERVER_ERROR)
            .json({ error: "Failed to log out" });
        }
      });
  
      req.session = null;
      return res
        .status(HTTP_CONFIG.OK)
        .json({ message: "Logged out successfully" });
    }
  );





