import { ErrorRequestHandler } from "express";
import { HTTP_CONFIG } from "../config/http.config";
import { AppError } from "../utils/appError";

export const errorHandler: ErrorRequestHandler = (err, req, res, next) => {

   if(err instanceof SyntaxError) {
    return res.status(HTTP_CONFIG.BAD_REQUEST).json({
        message: "Invalid JSON payload"
    })
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