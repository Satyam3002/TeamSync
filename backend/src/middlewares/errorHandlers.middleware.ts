import { ErrorRequestHandler, Response } from "express";
import { HTTP_CONFIG } from "../config/http.config";
import { AppError } from "../utils/appError";
import { ZodError } from "zod";

const formatZodError = (res: Response, err: ZodError) => {
    const errors = err.errors.map((error) => {
        return {
            path: error.path,
            message: error.message,
        }
    })
    return res.status(HTTP_CONFIG.BAD_REQUEST).json({
        message: "Validation error",
        errors,
    })
}

export const errorHandler: ErrorRequestHandler = (err, req, res, next) => {

   if(err instanceof SyntaxError) {
    return res.status(HTTP_CONFIG.BAD_REQUEST).json({
        message: "Invalid JSON payload"
    })
   }
   if(err instanceof ZodError) {
    return formatZodError(res, err);
   }
   if(err instanceof AppError) {
   return res.status(err.statusCode).json({
    message: err.message,
    errorCode: err.errorCode
   })
   }

   return res.status(HTTP_CONFIG.INTERNAL_SERVER_ERROR).json({
    message: "Internal server error",
    error: err?.message || "Unknown error occured"
   });


   
}