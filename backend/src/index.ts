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
import memberRoutes from "./routes/member.route";
import projectRoutes from "./routes/project.route";
import taskRoutes from "./routes/task.route";

const app = express();
const BASE_PATH = config.BASE_PATH;

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(session({
    name:"session",
    keys:[config.SESSION_SECRET],
    maxAge: 24 * 60 * 60 * 1000,
    httpOnly: true,
    secure: config.NODE_ENV === "production", // Use secure cookies in production
    sameSite: config.NODE_ENV === "production" ? "none" : "lax", // Allow cross-site cookies in production
    path: "/", // Ensure cookies are sent for all paths
}));
app.use(passport.initialize());
app.use(passport.session());

app.use(cors({
    origin: [
        "http://localhost:3000",
        "http://localhost:5173", 
        "https://team-sync-phi.vercel.app",
        config.FRONTEND_ORIGIN
    ].filter(Boolean),
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Cookie", "Set-Cookie"],
    exposedHeaders: ["Set-Cookie"],
}));
app.get("/",(req:Request,res:Response,next:NextFunction)=>{
    res.status(HTTP_CONFIG.OK).json({
        message:"Hello World"
    });
});

// Debug endpoint to check session state
app.get("/debug-session",(req:Request,res:Response,next:NextFunction)=>{
    console.log("Session debug:", {
        session: req.session,
        user: req.user,
        passport: req.session?.passport,
        isAuthenticated: !!req.user,
        cookies: req.headers.cookie,
        origin: req.headers.origin,
        sessionName: "session"
    });
    
    res.status(HTTP_CONFIG.OK).json({
        message:"Session debug",
        session: req.session,
        user: req.user,
        passport: req.session?.passport,
        isAuthenticated: !!req.user,
        hasCookies: !!req.headers.cookie,
        origin: req.headers.origin,
        sessionName: "session"
    });
});

// Health check endpoint
app.get("/health",(req:Request,res:Response,next:NextFunction)=>{
    res.status(HTTP_CONFIG.OK).json({
        message:"Backend is running",
        timestamp: new Date().toISOString(),
        environment: config.NODE_ENV
    });
});

app.use(`${BASE_PATH}/auth`,authRoutes);
app.use(`${BASE_PATH}/user`,isAuthenticated,userRoutes);
app.use(`${BASE_PATH}/workspace`,isAuthenticated,workspaceRoutes);
app.use(`${BASE_PATH}/member`,isAuthenticated,memberRoutes);
app.use(`${BASE_PATH}/project`,isAuthenticated,projectRoutes);
app.use(`${BASE_PATH}/task`,isAuthenticated,taskRoutes);

app.listen(config.PORT, async()=>{
    console.log(`Server is running on port ${config.PORT}`);
    console.log(`Environment: ${config.NODE_ENV}`);
    console.log(`Frontend Origin: ${config.FRONTEND_ORIGIN}`);
    await connectDatabase();
});