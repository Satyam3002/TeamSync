import "dotenv/config";
import cors from "cors";
import express,{NextFunction,Request,Response} from "express";
import session from "cookie-session";
import config from "./config/app.config";
import connectDatabase from "./config/database.config";
import { HTTP_CONFIG } from "./config/http.config";

const app = express();
const BASE_PATH = config.BASE_PATH;

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(session({
    name:"session",
    keys:[config.SESSION_SECRET],
    maxAge: 24 * 60 * 60 * 1000,
    httpOnly:true,
    sameSite:"lax",
}));

app.use(cors({
    origin:config.FRONTEND_ORIGIN,
    credentials:true,
}));
app.get("/",(req:Request,res:Response,next:NextFunction)=>{
    res.status(HTTP_CONFIG.OK).json({
        message:"Hello World"
    });
});


app.listen(config.PORT, async()=>{
    console.log(`Server is running on port ${config.PORT}`);
    await connectDatabase();
});