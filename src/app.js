import express from "express"; 
import cors from "cors"; 
import cookieParser from "cookie-parser"; 

const app = express(); 

app.use(
    cors({
        origin: process.env.CORS_ORIGIN, 
        credentials: true, 
    }),
);

app.use(express.json({ limit: "16kb" })); 
app.use(express.urlencoded({ extended: true, limit: "16kb" })); 
app.use(express.static("public")); 
app.use(cookieParser()); 

import userRouter from "../src/routes/educase.routes.js"; 
app.use("/api/v1/educase", userRouter);                           

//https://localhost:8000/api/v1/educase
export { app };
