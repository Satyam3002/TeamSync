import "dotenv/config";
import cors from "cors";
import express,{NextFunction,Request,Response} from "express";
import session from "cookie-session";
import config from "./config/app.config";
import connectDatabase from "./config/database.config";
import { HTTP_CONFIG } from "./config/http.config";
import "./config/passport.config";
import passport from "passport";
import authRoutes from "./routes/auth.route";
import userRoutes from "./routes/user.route";
import { isAuthenticated } from "./middlewares/isAuthenticated.middleware";
import workspaceRoutes from "./routes/workspace.route";

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
app.use(passport.initialize());
app.use(passport.session());

app.use(cors({
    origin:config.FRONTEND_ORIGIN,
    credentials:true,
}));
app.get("/",(req:Request,res:Response,next:NextFunction)=>{
    res.status(HTTP_CONFIG.OK).json({
        message:"Hello World"
    });
});

app.use(`${BASE_PATH}/auth`,authRoutes);
app.use(`${BASE_PATH}/user`,isAuthenticated,userRoutes);
app.use(`${BASE_PATH}/workspace`,isAuthenticated,workspaceRoutes);

app.listen(config.PORT, async()=>{
    console.log(`Server is running on port ${config.PORT}`);
    await connectDatabase();
});